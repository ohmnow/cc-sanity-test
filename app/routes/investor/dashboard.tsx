import {useUser} from '@clerk/react-router'
import {Link} from 'react-router'
import {ArrowRight, FileText, TrendingUp, Clock, CheckCircle} from 'lucide-react'

export default function InvestorDashboard() {
  const {user} = useUser()

  return (
    <div className="py-8">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="font-display text-3xl text-[#1a1a1a] mb-2">
            Welcome back, {user?.firstName || 'Investor'}
          </h1>
          <p className="text-gray-600">
            Here's an overview of your investment activity and available opportunities.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            {
              label: 'Active Opportunities',
              value: '3',
              icon: FileText,
              color: 'bg-blue-500',
            },
            {
              label: 'Submitted LOIs',
              value: '1',
              icon: Clock,
              color: 'bg-yellow-500',
            },
            {
              label: 'Approved Investments',
              value: '0',
              icon: CheckCircle,
              color: 'bg-green-500',
            },
            {
              label: 'Total Invested',
              value: '$0',
              icon: TrendingUp,
              color: 'bg-[#c9a961]',
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#1a1a1a]">{stat.value}</p>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Available Opportunities */}
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-xl text-[#1a1a1a]">
                Latest Opportunities
              </h2>
              <Link
                to="/investor/opportunities"
                className="text-[#c9a961] hover:underline text-sm flex items-center gap-1"
              >
                View all
                <ArrowRight size={14} />
              </Link>
            </div>
            <div className="space-y-4">
              <p className="text-gray-500 text-center py-8">
                No opportunities available yet. Check back soon!
              </p>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <h2 className="font-display text-xl text-[#1a1a1a] mb-4">
              Recent Activity
            </h2>
            <div className="space-y-4">
              <p className="text-gray-500 text-center py-8">
                No recent activity. Start by exploring available opportunities.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-8 bg-[#1a1a1a] rounded-xl p-8 text-center">
          <h2 className="font-display text-2xl text-white mb-2">
            Ready to Invest?
          </h2>
          <p className="text-white/70 mb-6">
            Browse our current investment opportunities and submit a Letter of Intent.
          </p>
          <Link
            to="/investor/opportunities"
            className="btn-gold px-8 py-3 rounded-lg inline-flex items-center gap-2 font-semibold"
          >
            View Opportunities
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  )
}
