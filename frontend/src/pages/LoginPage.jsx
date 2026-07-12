import { Card } from "../components/ui/Card.jsx";
import { LoginForm } from "../components/auth/LoginForm.jsx";

export const LoginPage = () => (
  <Card>
    <div className="mb-6 text-center">
      <h1 className="text-xl font-semibold tracking-tight text-slate-900">Anti-Kuddus Protocol</h1>
      <p className="mt-1 text-sm text-slate-500">Sign in with your roll number and PIN.</p>
    </div>
    <LoginForm />
  </Card>
);
