
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulating login process
    try {
      // For demo purposes, implement basic validation
      if (!email || !password) {
        throw new Error('Por favor, preencha todos os campos.');
      }
      
      // For demo, check if it's admin credentials
      if (email === 'admin@carolstore.com' && password === 'admin123') {
        // Admin login
        toast({
          title: "Login de administrador bem-sucedido!",
          description: "Bem-vindo(a) ao painel administrativo.",
        });
        navigate('/admin/dashboard');
      } else {
        // Regular user login - in a real app, this would validate against a backend
        toast({
          title: "Login bem-sucedido!",
          description: "Bem-vindo(a) à CarolStoreUdi.",
        });
        navigate('/');
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro de login",
        description: error.message || "Ocorreu um erro. Verifique suas credenciais.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="font-playfair text-2xl text-center">Entrar</CardTitle>
        <CardDescription className="text-center">
          Faça login na sua conta para continuar
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Senha</Label>
              <Link to="/esqueci-senha" className="text-xs text-carol-red hover:underline">
                Esqueceu a senha?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button 
            type="submit" 
            className="w-full bg-carol-red hover:bg-carol-red/90"
            disabled={isLoading}
          >
            {isLoading ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <div className="text-center text-sm">
          Não tem uma conta?{" "}
          <Link to="/registrar" className="text-carol-red hover:underline">
            Registrar-se
          </Link>
        </div>
        <p className="text-xs text-center text-muted-foreground">
          Ao continuar, você concorda com nossos{" "}
          <Link to="/termos" className="underline">Termos de Serviço</Link>
          {" "}e{" "}
          <Link to="/privacidade" className="underline">Política de Privacidade</Link>.
        </p>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
