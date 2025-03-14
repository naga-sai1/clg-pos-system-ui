import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

const actions = [
  { key: "VAT", tooltip: "Add VAT to transaction" },
  { key: "Fee", tooltip: "Add additional fees" },
  { key: "Refund", tooltip: "Process refund" },
  { key: "Coupon", tooltip: "Apply coupon code" },
  { key: "PLU", tooltip: "Price Look-Up" },
]

export function QuickActions() {
  return (
    <TooltipProvider>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {actions.map((action) => (
          <Tooltip key={action.key}>
            <TooltipTrigger asChild>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  variant="outline"
                  className="w-full h-14 text-[#33A9FF] border-[#33A9FF] hover:bg-[#33A9FF]/10 transition-colors text-base"
                >
                  {action.key}
                </Button>
              </motion.div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{action.tooltip}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  )
}

