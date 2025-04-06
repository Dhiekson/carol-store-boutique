
import React, { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      console.log("Attempting login with:", email);
      const { error: signInError } = await signIn(email, password);
      
      if (signInError) {
        console.error('Erro de login:', signInError);
        setError(signInError.message || 'Falha no login. Verifique suas credenciais.');
      } else {
        // Login successful - redirection happens in AuthContext
        toast({
          title: "Login realizado com sucesso",
          description: "Você está sendo redirecionado...",
        });
      }
    } catch (err) {
      console.error('Erro durante login:', err);
      setError('Ocorreu um erro inesperado. Por favor, tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-sm border">
      <div className="text-center mb-6">
        <h1 className="font-playfair text-2xl font-bold mb-2">Bem-vindo(a) de volta!</h1>
        <p className="text-gray-600">Entre com seus dados para acessar sua conta</p>
      </div>
      
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              className="pl-10"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="password">Senha</Label>
            <Link to="/esqueci-senha" className="text-carol-red hover:text-carol-red/90 text-xs">
              Esqueceu a senha?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              className="pl-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>
        
        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-carol-red hover:bg-carol-red/90"
        >
          {loading ? (
            <span className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Entrando...
            </span>
          ) : (
            "Entrar"
          )}
        </Button>
        
        <div className="text-center text-xs text-gray-500 border-t border-gray-100 pt-4 mt-4">
          <p>Credenciais de administrador para teste:</p>
          <p className="font-mono bg-gray-50 p-1 rounded mt-1">admin@carolstore.com / Admin123@</p>
        </div>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Não tem uma conta?{" "}
          <Link to="/registrar" className="text-carol-red hover:text-carol-red/90 font-medium">
            Registre-se
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
