import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';

const CartConfirmModal = ({ isOpen, onClose, onDouble, productName }) => {
  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            className="relative bg-card border border-glass-border/30 rounded-3xl shadow-2xl p-8 max-w-md w-full"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', duration: 0.5 }}
          >
            <h3 className="text-xl font-serif font-bold text-foreground mb-2">
              Product Already in Cart
            </h3>
            <p className="text-muted-foreground mb-6">
              &ldquo;{productName}&rdquo; is already in your cart. Would you like to double the quantity?
            </p>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-3 px-6 rounded-xl border border-glass-border/30 text-foreground font-semibold hover:bg-muted transition-all"
              >
                Cancel
              </button>
              <button
                onClick={onDouble}
                className="flex-1 py-3 px-6 rounded-xl bg-gradient-to-r from-gold to-gold-dark text-primary-foreground font-bold hover:shadow-lg transition-all"
              >
                Double Quantity
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default CartConfirmModal;
