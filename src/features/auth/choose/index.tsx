//@ts-nocheck
import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { storage } from '@/lib/storage'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Receipt,
  Package2,
  ArrowRight,
  DollarSign,
  BarChart3,
  Users,
  Tag,
  Zap,
  ShoppingCart,
  Boxes,
} from 'lucide-react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'

const FeatureIcon = ({ Icon }: { Icon: typeof Receipt }) => (
  <div className='rounded-full bg-orange-100 p-2 shadow-md'>
    <Icon className='w-5 h-5 text-orange-500' />
  </div>
)

const BackgroundAnimation = () => (
  <div className='absolute inset-0 overflow-hidden'>
    {[...Array(20)].map((_, i) => (
      <motion.div
        key={i}
        className='absolute bg-white opacity-10 rounded-full'
        style={{
          width: Math.random() * 100 + 50,
          height: Math.random() * 100 + 50,
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
        }}
        animate={{
          y: [0, Math.random() * 200 - 100],
          x: [0, Math.random() * 200 - 100],
        }}
        transition={{
          duration: Math.random() * 10 + 10,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: 'reverse',
        }}
      />
    ))}
  </div>
)

export default function ChooseOne() {
  const isAdmin = storage.isAdmin();
  const isCashier = storage.isCashier();
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  const modules = [
    {
      title: 'Billing Module',
      description: 'Effortlessly manage transactions and customer payments',
      icon: Receipt,
      features: ['Process Sales', 'Manage Invoices', 'Customer Management'],
      to: '/billings',
      color: 'from-orange-400 to-orange-500',
      secondaryIcon: ShoppingCart,
    },
    {
      title: 'Inventory Module',
      description: 'Keep track of stock levels and product information',
      icon: Package2,
      features: ['Stock Management', 'Product Tracking', 'Supplier Portal'],
      to: '/products',
      color: 'from-orange-500 to-orange-600',
      secondaryIcon: Boxes,
    },
  ]

  return (
    <div className='min-h-screen bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center p-4 overflow-hidden relative'>
      <BackgroundAnimation />
      <div className="absolute inset-0 bg-[url('/orange-texture.png')] opacity-10 mix-blend-overlay"></div>

      <div className='w-full max-w-6xl px-4 z-10'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className='text-center mb-16'
        >
          <h1 className='text-6xl font-extrabold text-white drop-shadow-lg mb-4'>
            Point of Sale System
          </h1>
          <p className='text-xl text-white text-opacity-90 drop-shadow max-w-2xl mx-auto'>
            Streamline your business operations with our powerful POS solution
          </p>
        </motion.div>

        <div className='grid md:grid-cols-2 gap-12'>
          {(isAdmin || isCashier) && (
            <Link
              to="/billings"
              onMouseEnter={() => setHoveredCard('Billing Module')}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Card
                  className={`bg-gradient-to-br from-orange-400 to-orange-500 border-none shadow-lg overflow-hidden group relative`}
                >
                  <div className='absolute inset-0 bg-white opacity-90 transition-opacity duration-300 group-hover:opacity-100'></div>
                  <CardHeader className='relative'>
                    <div className='flex items-center justify-between'>
                      <Receipt className='w-16 h-16 text-orange-500' />
                      <ArrowRight
                        className={`w-8 h-8 text-orange-500 transition-transform duration-300 ${hoveredCard === 'Billing Module' ? 'translate-x-2' : ''}`}
                      />
                    </div>
                    <CardTitle className='text-4xl mt-6 text-orange-600 font-bold'>
                      Billing Module
                    </CardTitle>
                    <CardDescription className='text-orange-700 text-lg mt-2'>
                      Effortlessly manage transactions and customer payments
                    </CardDescription>
                  </CardHeader>
                  <CardContent className='relative'>
                    <div className='flex flex-wrap gap-4 items-center text-sm text-orange-700 mt-4'>
                      {['Process Sales', 'Manage Invoices', 'Customer Management'].map((feature, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: i * 0.1 }}
                          className='flex items-center gap-2 bg-orange-100 rounded-full px-4 py-2 shadow-sm'
                        >
                          <FeatureIcon
                            Icon={
                              i === 0 ? DollarSign : i === 1 ? BarChart3 : Users
                            }
                          />
                          {feature}
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                  <AnimatePresence>
                    {hoveredCard === 'Billing Module' && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                        className='absolute bottom-4 right-4'
                      >
                        <ShoppingCart className='w-12 h-12 text-orange-400 opacity-50' />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </motion.div>
            </Link>
          )}
          {isAdmin && (
            <Link
              to="/inventory-management/products"
              onMouseEnter={() => setHoveredCard('Inventory Module')}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card
                  className={`bg-gradient-to-br from-orange-500 to-orange-600 border-none shadow-lg overflow-hidden group relative`}
                >
                  <div className='absolute inset-0 bg-white opacity-90 transition-opacity duration-300 group-hover:opacity-100'></div>
                  <CardHeader className='relative'>
                    <div className='flex items-center justify-between'>
                      <Package2 className='w-16 h-16 text-orange-500' />
                      <ArrowRight
                        className={`w-8 h-8 text-orange-500 transition-transform duration-300 ${hoveredCard === 'Inventory Module' ? 'translate-x-2' : ''}`}
                      />
                    </div>
                    <CardTitle className='text-4xl mt-6 text-orange-600 font-bold'>
                      Inventory Module
                    </CardTitle>
                    <CardDescription className='text-orange-700 text-lg mt-2'>
                      Keep track of stock levels and product information
                    </CardDescription>
                  </CardHeader>
                  <CardContent className='relative'>
                    <div className='flex flex-wrap gap-4 items-center text-sm text-orange-700 mt-4'>
                      {['Stock Management', 'Product Tracking', 'Supplier Portal'].map((feature, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: i * 0.1 }}
                          className='flex items-center gap-2 bg-orange-100 rounded-full px-4 py-2 shadow-sm'
                        >
                          <FeatureIcon
                            Icon={
                              i === 0 ? DollarSign : i === 1 ? BarChart3 : Users
                            }
                          />
                          {feature}
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                  <AnimatePresence>
                    {hoveredCard === 'Inventory Module' && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                        className='absolute bottom-4 right-4'
                      >
                        <Boxes className='w-12 h-12 text-orange-400 opacity-50' />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </motion.div>
            </Link>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className='mt-16 text-center'
        >
          <p className='text-lg text-white drop-shadow inline-flex items-center gap-2 bg-orange-500 bg-opacity-20 px-6 py-3 rounded-full'>
            <Tag className='w-5 h-5' />
            Need assistance? Contact our support team
          </p>
        </motion.div>
      </div>
    </div>
  )
}
