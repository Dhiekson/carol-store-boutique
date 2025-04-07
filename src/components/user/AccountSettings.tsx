
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

const AccountSettings = () => {
  const { profile, updateProfile } = useAuth();
  const [preferences, setPreferences] = useState({
    notifications: profile?.preferences?.notifications || false,
    newsletter: profile?.preferences?.newsletter || false,
    theme: profile?.preferences?.theme || 'light'
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSwitchChange = (key: string) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev]
    }));
  };

  const handleThemeChange = (theme: string) => {
    setPreferences(prev => ({
      ...prev,
      theme
    }));
  };

  const savePreferences = async () => {
    setLoading(true);
    try {
      await updateProfile({ preferences });
      toast({
        title: "Preferências salvas",
        description: "Suas preferências foram atualizadas com sucesso."
      });
    } catch (error) {
      console.error('Error updating preferences:', error);
      toast({
        title: "Erro ao salvar preferências",
        description: "Ocorreu um erro ao salvar suas preferências.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h2 className="font-semibold text-xl mb-6">Preferências da Conta</h2>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-4">Notificações</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="notifications" className="text-base">
                  Notificações por email
                </Label>
                <p className="text-sm text-gray-500">
                  Receba notificações sobre seus pedidos e conta
                </p>
              </div>
              <Switch 
                id="notifications" 
                checked={preferences.notifications} 
                onCheckedChange={() => handleSwitchChange('notifications')}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="newsletter" className="text-base">
                  Newsletter
                </Label>
                <p className="text-sm text-gray-500">
                  Receba nossas novidades e promoções
                </p>
              </div>
              <Switch 
                id="newsletter" 
                checked={preferences.newsletter} 
                onCheckedChange={() => handleSwitchChange('newsletter')}
              />
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-4">Tema</h3>
          <div className="flex gap-4">
            <Button 
              variant={preferences.theme === 'light' ? 'default' : 'outline'}
              onClick={() => handleThemeChange('light')}
              className={preferences.theme === 'light' ? 'bg-carol-red hover:bg-carol-red/90' : ''}
            >
              Claro
            </Button>
            <Button 
              variant={preferences.theme === 'dark' ? 'default' : 'outline'}
              onClick={() => handleThemeChange('dark')}
              className={preferences.theme === 'dark' ? 'bg-carol-red hover:bg-carol-red/90' : ''}
            >
              Escuro
            </Button>
          </div>
        </div>
        
        <div className="pt-4 border-t border-gray-100">
          <Button 
            onClick={savePreferences} 
            disabled={loading}
            className="bg-carol-red hover:bg-carol-red/90"
          >
            {loading ? 'Salvando...' : 'Salvar preferências'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
