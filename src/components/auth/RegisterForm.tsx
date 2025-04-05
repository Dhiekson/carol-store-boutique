
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

const RegisterForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulating registration process
    try {
      // For demo purposes, implement basic validation
      if (!name || !email || !password || !confirmPassword) {
        throw new Error('Por favor, preencha todos os campos.');
      }
      
      if (password !== confirmPassword) {
        throw new Error('As senhas não coincidem.');
      }
      
      if (password.length < 6) {
        throw new Error('A senha deve ter pelo menos 6 caracteres.');
      }
      
      // Simulate successful registration
      toast({
        title: "Registro bem-sucedido!",
        description: "Sua conta foi criada com sucesso.",
      });
      
      // Redirect to login page
      navigate('/login');
      
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro no registro",
        description: error.message || "Ocorreu um erro ao criar sua conta.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="font-playfair text-2xl text-center">Criar Conta</CardTitle>
        <CardDescription className="text-center">
          Registre-se para começar a comprar
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome Completo</Label>
            <Input
              id="name"
              type="text"
              placeholder="Maria Silva"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
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
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar Senha</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <Button 
            type="submit" 
            className="w-full bg-carol-red hover:bg-carol-red/90"
            disabled={isLoading}
          >
            {isLoading ? 'Registrando...' : 'Registrar'}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <div className="text-center text-sm">
          Já tem uma conta?{" "}
          <Link to="/login" className="text-carol-red hover:underline">
            Entrar
          </Link>
        </div>
        <p className="text-xs text-center text-muted-foreground">
          Ao se registrar, você concorda com nossos{" "}
          <Link to="/termos" className="underline">Termos de Serviço</Link>
          {" "}e{" "}
          <Link to="/privacidade" className="underline">Política de Privacidade</Link>.
        </p>
      </CardFooter>
    </Card>
  );
};

export default RegisterForm;
