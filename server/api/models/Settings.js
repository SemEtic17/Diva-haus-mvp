import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  siteName: {
    type: String,
    default: 'Diva Haus',
    required: true
  },
  siteDescription: {
    type: String,
    default: 'Luxury Boutique E-Commerce'
  },
  adminEmail: {
    type: String,
    default: 'admin@divahaus.com'
  },
  supportEmail: {
    type: String,
    default: 'support@divahaus.com'
  },
  enableRegistration: {
    type: Boolean,
    default: true
  },
  maintenanceMode: {
    type: Boolean,
    default: false
  },
  currency: {
    type: String,
    default: 'USD'
  },
  aiProvider: {
    type: String,
    default: 'Kolors (Hugging Face)'
  }
}, {
  timestamps: true
});

const Settings = mongoose.model('Settings', settingsSchema);

export default Settings;
