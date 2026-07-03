import { useState, type FormEvent } from 'react';
import type { LoginCredentials } from '../domain/authTypes';

interface LoginFormProps {
  defaultEmail: string;
  defaultPassword: string;
  isSubmitting: boolean;
  error: string | null;
  onSubmit: (credentials: LoginCredentials) => void;
}

export function LoginForm({ defaultEmail, defaultPassword, isSubmitting, error, onSubmit }: LoginFormProps) {
  const [email, setEmail] = useState(defaultEmail);
  const [password, setPassword] = useState(defaultPassword);

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    onSubmit({ email: email.trim(), password });
  }

  return (
    <form className="login-card" onSubmit={handleSubmit}>
      <div className="login-card__brand">
        <span>CPA</span>
        <div>
          <strong>Reportería contable</strong>
          <small>Acceso interno autorizado</small>
        </div>
      </div>

      <div className="login-card__heading">
        <p className="report-kicker">Inicio de sesión</p>
        <h1>Ingresa para consultar los reportes financieros.</h1>
        <p>La información contable queda protegida antes de acceder a Libro Diario, Mayor, EEFF, Balance y Flujo de Caja.</p>
      </div>

      <label className="login-field">
        Correo institucional
        <input value={email} type="email" autoComplete="email" onChange={(event) => setEmail(event.target.value)} />
      </label>

      <label className="login-field">
        Contraseña
        <input value={password} type="password" autoComplete="current-password" onChange={(event) => setPassword(event.target.value)} />
      </label>

      {error ? <p className="login-error" role="alert">{error}</p> : null}

      <button className="button button--primary login-card__submit" type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Validando acceso...' : 'Entrar a reportería'}
      </button>

    </form>
  );
}
