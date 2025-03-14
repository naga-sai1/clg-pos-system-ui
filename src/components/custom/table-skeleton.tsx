'use client'

import type React from 'react'
import { motion } from 'framer-motion'

const ModernTableSkeleton: React.FC = () => {
  const shimmer = {
    hidden: { opacity: 0.3 },
    visible: { opacity: 1 },
  }

  return (
    <div className='p-4 bg-gray-50 dark:bg-gray-900'>
      <motion.div
        className='bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Table Header */}
        <div className='flex border-b border-gray-200 dark:border-gray-700 p-4'>
          {[...Array(4)].map((_, index) => (
            <motion.div
              key={index}
              className='flex-1 pr-4'
              initial='hidden'
              animate='visible'
              variants={shimmer}
              transition={{
                repeat: Number.POSITIVE_INFINITY,
                duration: 1.5,
                repeatType: 'reverse',
              }}
            >
              <div className='h-6 bg-gray-200 dark:bg-gray-700 rounded-md w-3/4'></div>
            </motion.div>
          ))}
          <motion.div
            className='w-20'
            initial='hidden'
            animate='visible'
            variants={shimmer}
            transition={{
              repeat: Number.POSITIVE_INFINITY,
              duration: 1.5,
              repeatType: 'reverse',
            }}
          >
            <div className='h-6 bg-gray-200 dark:bg-gray-700 rounded-md'></div>
          </motion.div>
        </div>

        {/* Table Body */}
        {[...Array(5)].map((_, rowIndex) => (
          <motion.div
            key={rowIndex}
            className='flex border-b border-gray-100 dark:border-gray-700 p-4'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: rowIndex * 0.1 }}
          >
            {[...Array(4)].map((_, colIndex) => (
              <motion.div
                key={colIndex}
                className='flex-1 pr-4'
                initial='hidden'
                animate='visible'
                variants={shimmer}
                transition={{
                  repeat: Number.POSITIVE_INFINITY,
                  duration: 1.5,
                  repeatType: 'reverse',
                }}
              >
                <div className='h-4 bg-gray-100 dark:bg-gray-600 rounded-md w-full'></div>
              </motion.div>
            ))}
            <motion.div className='w-20 flex justify-end'>
              <div className='h-4 w-4 bg-gray-100 dark:bg-gray-600 rounded-md'></div>
            </motion.div>
          </motion.div>
        ))}

        {/* Table Footer */}
        <motion.div
          className='flex items-center justify-between px-4 py-3'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <motion.div
            className='flex-1'
            initial='hidden'
            animate='visible'
            variants={shimmer}
            transition={{
              repeat: Number.POSITIVE_INFINITY,
              duration: 1.5,
              repeatType: 'reverse',
            }}
          >
            <div className='h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded-md'></div>
          </motion.div>
          <div className='flex space-x-2'>
            {[...Array(3)].map((_, index) => (
              <motion.div
                key={index}
                className='h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-md'
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              ></motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default ModernTableSkeleton
