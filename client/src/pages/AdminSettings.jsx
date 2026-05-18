import React, { useState, useEffect } from 'react';
import { Save, Globe, Shield, Bell, Database, Loader2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { toast } from '../components/Toaster';
import { getSettings, updateSettings } from '../api';

const AdminSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    siteName: '',
    siteDescription: '',
    adminEmail: '',
    supportEmail: '',
    enableRegistration: true,
    maintenanceMode: false,
    currency: 'USD',
    aiProvider: ''
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const data = await getSettings();
      if (data) {
        setSettings(data);
      }
    } catch (error) {
      toast.error(error.message || 'Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleToggle = (name) => {
    setSettings(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateSettings(settings);
      toast.success('Settings updated successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="w-8 h-8 text-gold animate-spin" />
        <p className="text-muted-foreground animate-pulse">Loading system settings...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-serif font-bold tracking-tight">System Settings</h1>
        <p className="text-muted-foreground italic">Configure your luxury ecosystem and AI integrations</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-gold" />
              <CardTitle>General Configuration</CardTitle>
            </div>
            <CardDescription>Basic information about your store</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Site Name</label>
                <Input 
                  name="siteName" 
                  value={settings.siteName} 
                  onChange={handleChange} 
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Currency</label>
                <Input 
                  name="currency" 
                  value={settings.currency} 
                  onChange={handleChange} 
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Site Description</label>
              <Textarea 
                name="siteDescription" 
                value={settings.siteDescription} 
                onChange={handleChange} 
                rows={3}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Admin Email</label>
                <Input 
                  type="email"
                  name="adminEmail" 
                  value={settings.adminEmail} 
                  onChange={handleChange} 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Support Email</label>
                <Input 
                  type="email"
                  name="supportEmail" 
                  value={settings.supportEmail} 
                  onChange={handleChange} 
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI & Integration */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-gold" />
              <CardTitle>AI Integration</CardTitle>
            </div>
            <CardDescription>Virtual Try-On API and provider settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">AI Provider</label>
              <Input 
                name="aiProvider" 
                value={settings.aiProvider} 
                onChange={handleChange} 
                disabled
              />
              <p className="text-xs text-muted-foreground">Currently managed via environment variables.</p>
            </div>
          </CardContent>
        </Card>

        {/* Security & Access */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-gold" />
              <CardTitle>Security & Access</CardTitle>
            </div>
            <CardDescription>Manage user registration and maintenance mode</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div 
               className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-glass-border/20 cursor-pointer hover:bg-white/10 transition-colors"
               onClick={() => handleToggle('enableRegistration')}
             >
                <div>
                  <p className="text-sm font-medium">Enable User Registration</p>
                  <p className="text-xs text-muted-foreground">Allow new customers to create accounts</p>
                </div>
                <div className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${settings.enableRegistration ? 'bg-gold' : 'bg-white/10'}`}>
                  <div className={`absolute top-1 w-4 h-4 bg-black rounded-full transition-all duration-300 ${settings.enableRegistration ? 'right-1' : 'left-1 bg-muted-foreground'}`} />
                </div>
             </div>
             <div 
               className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-glass-border/20 cursor-pointer hover:bg-white/10 transition-colors"
               onClick={() => handleToggle('maintenanceMode')}
             >
                <div>
                  <p className="text-sm font-medium">Maintenance Mode</p>
                  <p className="text-xs text-muted-foreground">Disable public access to the storefront</p>
                </div>
                <div className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${settings.maintenanceMode ? 'bg-gold' : 'bg-white/10'}`}>
                  <div className={`absolute top-1 w-4 h-4 bg-black rounded-full transition-all duration-300 ${settings.maintenanceMode ? 'right-1' : 'left-1 bg-muted-foreground'}`} />
                </div>
             </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button 
            type="submit" 
            disabled={saving}
            className="min-w-[180px] bg-gold text-black hover:bg-gold/90 h-12"
          >
            {saving ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving Changes...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Save className="w-4 h-4" />
                Save All Settings
              </div>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AdminSettings;
