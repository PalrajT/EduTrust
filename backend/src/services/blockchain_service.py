"""
Blockchain Service for Certificate Verification
Provides tamper-proof certificate storage and verification using blockchain technology
"""

import hashlib
import json
from typing import Dict, Optional, Tuple
from datetime import datetime
import secrets

from src.core.config import settings
from src.core.logging import logger

# Optional blockchain dependencies
try:
    from web3 import Web3
    from eth_account import Account
except ImportError:
    Web3 = None
    Account = None


class BlockchainService:
    """
    Blockchain service for certificate verification and storage
    Provides immutable record-keeping and tamper detection
    """
    
    def __init__(self):
        self.use_real_blockchain = settings.USE_REAL_BLOCKCHAIN if hasattr(settings, 'USE_REAL_BLOCKCHAIN') else False
        
        if self.use_real_blockchain and Web3 is not None:
            # Initialize Web3 connection (Ethereum/Polygon)
            self.w3 = Web3(Web3.HTTPProvider(settings.BLOCKCHAIN_RPC_URL))
            self.contract_address = settings.BLOCKCHAIN_CONTRACT_ADDRESS
            self.private_key = settings.BLOCKCHAIN_PRIVATE_KEY
            logger.info("Blockchain service initialized with real blockchain")
        else:
            # Use simulated blockchain for development
            self.blockchain = []
            self.pending_transactions = []
            logger.info("Blockchain service initialized in simulation mode")
    
    def calculate_hash(self, data: Dict) -> str:
        """
        Calculate SHA-256 hash of certificate data
        
        Args:
            data: Certificate data dictionary
            
        Returns:
            Hexadecimal hash string
        """
        # Sort keys to ensure consistent hashing
        sorted_data = json.dumps(data, sort_keys=True)
        return hashlib.sha256(sorted_data.encode()).hexdigest()
    
    def calculate_merkle_root(self, hashes: list) -> str:
        """
        Calculate Merkle root from list of hashes
        
        Args:
            hashes: List of transaction hashes
            
        Returns:
            Merkle root hash
        """
        if not hashes:
            return hashlib.sha256(b"").hexdigest()
        
        if len(hashes) == 1:
            return hashes[0]
        
        # Pair up hashes and hash them together
        new_level = []
        for i in range(0, len(hashes), 2):
            if i + 1 < len(hashes):
                combined = hashes[i] + hashes[i + 1]
            else:
                combined = hashes[i] + hashes[i]
            new_level.append(hashlib.sha256(combined.encode()).hexdigest())
        
        return self.calculate_merkle_root(new_level)
    
    async def store_certificate(
        self,
        certificate_data: Dict,
        issuer_id: str,
        recipient_id: str
    ) -> Tuple[str, str, Dict]:
        """
        Store certificate on blockchain
        
        Args:
            certificate_data: Certificate information
            issuer_id: ID of certificate issuer
            recipient_id: ID of certificate recipient
            
        Returns:
            Tuple of (transaction_hash, certificate_hash, block_info)
        """
        try:
            # Create certificate hash
            cert_hash = self.calculate_hash(certificate_data)
            
            # Create blockchain transaction
            transaction = {
                "certificate_hash": cert_hash,
                "certificate_number": certificate_data.get("certificate_number"),
                "issuer_id": issuer_id,
                "recipient_id": recipient_id,
                "issue_date": certificate_data.get("issue_date"),
                "timestamp": datetime.utcnow().isoformat(),
                "metadata": {
                    "institution": certificate_data.get("institution"),
                    "degree": certificate_data.get("degree"),
                    "student_name": certificate_data.get("student_name"),
                }
            }
            
            if self.use_real_blockchain and Web3 is not None:
                # Store on real blockchain
                tx_hash, block_info = await self._store_on_chain(transaction)
            else:
                # Store in simulated blockchain
                tx_hash, block_info = self._store_simulated(transaction)
            
            logger.info(f"Certificate stored on blockchain: {cert_hash[:16]}...")
            
            return tx_hash, cert_hash, block_info
            
        except Exception as e:
            logger.error(f"Blockchain storage error: {str(e)}")
            raise
    
    async def verify_certificate(
        self,
        certificate_data: Dict,
        stored_hash: Optional[str] = None
    ) -> Tuple[bool, Dict]:
        """
        Verify certificate against blockchain
        
        Args:
            certificate_data: Certificate data to verify
            stored_hash: Optional pre-computed hash to compare
            
        Returns:
            Tuple of (is_valid, verification_details)
        """
        try:
            # Calculate current hash
            current_hash = self.calculate_hash(certificate_data)
            
            # Search blockchain for matching certificate
            if self.use_real_blockchain and Web3 is not None:
                blockchain_record = await self._query_blockchain(current_hash)
            else:
                blockchain_record = self._query_simulated(current_hash)
            
            if not blockchain_record:
                return False, {
                    "status": "not_found",
                    "message": "Certificate not found on blockchain",
                    "current_hash": current_hash
                }
            
            # Check if hash matches
            stored_hash_value = blockchain_record.get("certificate_hash")
            hash_matches = (current_hash == stored_hash_value)
            
            # Check if certificate has been revoked
            is_revoked = blockchain_record.get("revoked", False)
            
            verification_details = {
                "status": "valid" if hash_matches and not is_revoked else "invalid",
                "hash_matches": hash_matches,
                "is_revoked": is_revoked,
                "blockchain_timestamp": blockchain_record.get("timestamp"),
                "transaction_hash": blockchain_record.get("transaction_hash"),
                "block_number": blockchain_record.get("block_number"),
                "issuer_id": blockchain_record.get("issuer_id"),
                "certificate_number": blockchain_record.get("certificate_number"),
                "tamper_detected": not hash_matches
            }
            
            return hash_matches and not is_revoked, verification_details
            
        except Exception as e:
            logger.error(f"Blockchain verification error: {str(e)}")
            return False, {
                "status": "error",
                "message": str(e)
            }
    
    async def revoke_certificate(
        self,
        certificate_hash: str,
        reason: str,
        revoker_id: str
    ) -> bool:
        """
        Revoke a certificate on blockchain
        
        Args:
            certificate_hash: Hash of certificate to revoke
            reason: Reason for revocation
            revoker_id: ID of user revoking certificate
            
        Returns:
            Success status
        """
        try:
            revocation_record = {
                "certificate_hash": certificate_hash,
                "revoked": True,
                "revocation_reason": reason,
                "revoked_by": revoker_id,
                "revocation_timestamp": datetime.utcnow().isoformat()
            }
            
            if self.use_real_blockchain and Web3 is not None:
                await self._store_on_chain(revocation_record)
            else:
                self._store_simulated(revocation_record)
            
            logger.info(f"Certificate revoked: {certificate_hash[:16]}...")
            return True
            
        except Exception as e:
            logger.error(f"Certificate revocation error: {str(e)}")
            return False
    
    def _store_simulated(self, transaction: Dict) -> Tuple[str, Dict]:
        """Store transaction in simulated blockchain"""
        # Generate transaction hash
        tx_hash = secrets.token_hex(32)
        transaction["transaction_hash"] = tx_hash
        
        # Add to pending transactions
        self.pending_transactions.append(transaction)
        
        # Mine block (simulate)
        if len(self.pending_transactions) >= 1:  # Mine every transaction for simplicity
            block = self._mine_block()
            return tx_hash, block
        
        return tx_hash, {"status": "pending"}
    
    def _mine_block(self) -> Dict:
        """Mine a new block (simulated)"""
        if not self.pending_transactions:
            return {}
        
        # Get previous block hash
        previous_hash = self.blockchain[-1]["hash"] if self.blockchain else "0" * 64
        
        # Calculate merkle root
        tx_hashes = [tx.get("transaction_hash", "") for tx in self.pending_transactions]
        merkle_root = self.calculate_merkle_root(tx_hashes)
        
        # Create new block
        block = {
            "block_number": len(self.blockchain),
            "timestamp": datetime.utcnow().isoformat(),
            "transactions": self.pending_transactions.copy(),
            "previous_hash": previous_hash,
            "merkle_root": merkle_root,
            "nonce": secrets.randbelow(1000000)
        }
        
        # Calculate block hash
        block["hash"] = self.calculate_hash(block)
        
        # Add block to blockchain
        self.blockchain.append(block)
        
        # Clear pending transactions
        self.pending_transactions = []
        
        logger.info(f"Block mined: #{block['block_number']} with {len(block['transactions'])} transactions")
        
        return block
    
    def _query_simulated(self, certificate_hash: str) -> Optional[Dict]:
        """Query simulated blockchain for certificate"""
        # Search through all blocks
        for block in reversed(self.blockchain):  # Start from most recent
            for transaction in block["transactions"]:
                if transaction.get("certificate_hash") == certificate_hash:
                    # Merge transaction with block info
                    result = transaction.copy()
                    result["block_number"] = block["block_number"]
                    result["block_hash"] = block["hash"]
                    result["block_timestamp"] = block["timestamp"]
                    return result
        return None
    
    async def _store_on_chain(self, transaction: Dict) -> Tuple[str, Dict]:
        """Store transaction on real blockchain (Ethereum/Polygon)"""
        if not self.w3 or not self.w3.is_connected():
            raise ConnectionError("Not connected to blockchain network")
        
        # TODO: Implement actual smart contract interaction
        # This is a placeholder for real blockchain integration
        
        # Example structure:
        # 1. Prepare transaction data
        # 2. Sign transaction with private key
        # 3. Send transaction to network
        # 4. Wait for confirmation
        # 5. Return transaction hash and block info
        
        raise NotImplementedError("Real blockchain storage not yet implemented")
    
    async def _query_blockchain(self, certificate_hash: str) -> Optional[Dict]:
        """Query real blockchain for certificate"""
        if not self.w3 or not self.w3.is_connected():
            raise ConnectionError("Not connected to blockchain network")
        
        # TODO: Implement actual smart contract query
        raise NotImplementedError("Real blockchain query not yet implemented")
    
    def get_blockchain_stats(self) -> Dict:
        """Get blockchain statistics"""
        if self.use_real_blockchain:
            return {
                "mode": "real",
                "network": "ethereum/polygon",
                "connected": self.w3.is_connected() if self.w3 else False
            }
        else:
            total_transactions = sum(len(block["transactions"]) for block in self.blockchain)
            return {
                "mode": "simulated",
                "total_blocks": len(self.blockchain),
                "total_transactions": total_transactions,
                "pending_transactions": len(self.pending_transactions),
                "latest_block": self.blockchain[-1] if self.blockchain else None
            }


# Singleton instance
blockchain_service = BlockchainService()
