import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext'
import { LineChart, Line, PieChart, Pie, Cell, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { FileCheck, AlertTriangle, Clock, Shield, Download, Filter, RefreshCw, TrendingUp } from 'lucide-react'
import { useToast } from '../context/ToastContext'
import LoadingSpinner from '../components/LoadingSpinner'

const AdminDashboard = () => {
  const { t } = useTranslation()
  const { user } = useAuth()
  const { addToast } = useToast()
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [timeRange, setTimeRange] = useState('6m') // 6 months default

  const handleRefresh = async () => {
    setIsRefreshing(true)
    addToast(t('admin.refreshing'), 'info')
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setIsRefreshing(false)
    addToast(t('admin.refreshSuccess'), 'success')
  }

  const handleExportData = () => {
    addToast(t('admin.exportingData'), 'info')
    
    // Simulate export
    setTimeout(() => {
      addToast(t('admin.exportSuccess'), 'success')
    }, 1000)
  }

  const stats = [
    {
      label: t('admin.stats.totalVerifications'),
      value: '15,234',
      icon: <FileCheck className="h-8 w-8" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      label: t('admin.stats.authenticCerts'),
      value: '14,892',
      icon: <Shield className="h-8 w-8" />,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      label: t('admin.stats.fakeCerts'),
      value: '342',
      icon: <AlertTriangle className="h-8 w-8" />,
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    },
    {
      label: t('admin.stats.pendingReviews'),
      value: '28',
      icon: <Clock className="h-8 w-8" />,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    }
  ]

  const verificationTrends = [
    { month: 'Jan', verifications: 1200, authentic: 1150, fake: 50 },
    { month: 'Feb', verifications: 1400, authentic: 1340, fake: 60 },
    { month: 'Mar', verifications: 1600, authentic: 1550, fake: 50 },
    { month: 'Apr', verifications: 1800, authentic: 1730, fake: 70 },
    { month: 'May', verifications: 2000, authentic: 1920, fake: 80 },
    { month: 'Jun', verifications: 2200, authentic: 2140, fake: 60 }
  ]

  const languageDistribution = [
    { name: 'English', value: 40 },
    { name: 'Hindi', value: 25 },
    { name: 'Tamil', value: 15 },
    { name: 'Telugu', value: 10 },
    { name: 'Others', value: 10 }
  ]

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

  const recentVerifications = [
    {
      id: 'DU-2024-001',
      student: 'Amit Kumar',
      institution: 'University of Delhi',
      status: 'Authentic',
      date: '2024-10-15'
    },
    {
      id: 'IITB-2024-042',
      student: 'Priya Sharma',
      institution: 'IIT Bombay',
      status: 'Authentic',
      date: '2024-10-15'
    },
    {
      id: 'MU-2024-089',
      student: 'Raj Patel',
      institution: 'Mumbai University',
      status: 'Fake',
      date: '2024-10-14'
    },
    {
      id: 'BITS-2024-156',
      student: 'Sneha Reddy',
      institution: 'BITS Pilani',
      status: 'Authentic',
      date: '2024-10-14'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Actions */}
        <div className="mb-8 animate-fade-in flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t('admin.title')}</h1>
            <p className="text-gray-600 mt-2">{t('admin.overview')}</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="btn-secondary flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              onClick={handleExportData}
              className="btn-primary flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export Data
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card animate-scale-in group" style={{animationDelay: `${index * 0.1}s`}}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 group-hover:scale-110 transition-transform duration-300">{stat.value}</p>
                  <div className="flex items-center mt-2 text-xs text-green-600">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    <span>+12% from last month</span>
                  </div>
                </div>
                <div className={`${stat.bgColor} ${stat.color} p-3 rounded-lg transform transition-all duration-500 group-hover:scale-125 group-hover:rotate-12`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Verification Trends */}
          <div className="card animate-slide-left">
            <h2 className="text-xl font-semibold mb-4">{t('admin.trends')}</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={verificationTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="verifications" stroke="#3b82f6" strokeWidth={2} />
                <Line type="monotone" dataKey="authentic" stroke="#10b981" strokeWidth={2} />
                <Line type="monotone" dataKey="fake" stroke="#ef4444" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Language Distribution */}
          <div className="card animate-slide-right">
            <h2 className="text-xl font-semibold mb-4">Language Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={languageDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {languageDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Verifications Table */}
        <div className="card animate-slide-up">
          <h2 className="text-xl font-semibold mb-4">{t('admin.recentVerifications')}</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('admin.table.certId')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('admin.table.student')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('admin.table.institution')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('admin.table.status')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('admin.table.date')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentVerifications.map((verification) => (
                  <tr key={verification.id} className="hover:bg-gray-50 transition-colors duration-200 cursor-pointer transform hover:scale-[1.02] transition-transform">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {verification.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {verification.student}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {verification.institution}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full transition-all duration-300 hover:scale-110 ${
                        verification.status === 'Authentic'
                          ? 'bg-green-100 text-green-800 hover:bg-green-200'
                          : 'bg-red-100 text-red-800 hover:bg-red-200'
                      }`}>
                        {verification.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {verification.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
