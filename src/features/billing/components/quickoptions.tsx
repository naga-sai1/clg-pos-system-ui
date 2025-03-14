import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

const quickOptions = [
  "New Order",
  "Easy Post (F2)",
  "Change Post (F3)",
  "Sale Post (F4)",
  "Add Item",
  "Check Gift Card",
  "Delivery",
  "Tax Exempt",
  "Promotions",
  "Sales Person",
  "More",
]

export function QuickOptions() {
  return (
    <div className="space-y-2">
      {quickOptions.map((option, index) => (
        <motion.div
          key={option}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.05 * index }}
        >
          <Button className="w-full h-12 text-base" variant="outline">
            {option}
          </Button>
        </motion.div>
      ))}
    </div>
  )
}

