import { Card } from './ui/card'
import { Badge } from './ui/badge'
import { Clock, CheckCircle, AlertCircle, Code } from 'lucide-react'

export function StatusBar() {
  const stats = [
    {
      label: 'Total Requirements',
      shortLabel: 'Total',
      value: '23',
      icon: AlertCircle,
      color: 'text-blue-600'
    },
    {
      label: 'Completed',
      shortLabel: 'Done',
      value: '15',
      icon: CheckCircle,
      color: 'text-green-600'
    },
    {
      label: 'In Progress',
      shortLabel: 'Progress',
      value: '8',
      icon: Clock,
      color: 'text-orange-600'
    },
    {
      label: 'IA Codes Generated',
      shortLabel: 'IA Codes',
      value: '45',
      icon: Code,
      color: 'text-purple-600'
    }
  ]

  return (
    <Card className="p-4">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:flex lg:items-center lg:gap-6 xl:gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="flex items-center gap-2 md:gap-3">
              <div className={`w-6 h-6 md:w-8 md:h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0`}>
                <stat.icon className={`w-3 h-3 md:w-4 md:h-4 ${stat.color}`} />
              </div>
              <div className="min-w-0">
                <p className="text-xs md:text-sm text-gray-600 truncate">
                  <span className="md:hidden">{stat.shortLabel}</span>
                  <span className="hidden md:inline">{stat.label}</span>
                </p>
                <p className="text-sm md:text-lg font-semibold text-gray-900">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Last Sync */}
        <div className="flex items-center justify-between lg:justify-end gap-4">
          <Badge variant="secondary" className="bg-green-100 text-green-800 whitespace-nowrap">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            동기화 완료
          </Badge>
          <div className="text-right">
            <p className="text-xs md:text-sm text-gray-600">Last Sync</p>
            <p className="text-xs md:text-sm font-medium text-gray-900">2024-02-21 15:42</p>
          </div>
        </div>
      </div>
    </Card>
  )
}