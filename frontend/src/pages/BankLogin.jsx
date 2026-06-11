import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { LogIn, AlertCircle } from "lucide-react";
import * as api from "@/lib/api";
import PageHeader from "@/components/PageHeader";

export default function BankLogin() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.loginWasteBank({ email, password });
      const { token, waste_bank_id } = res.data;
      localStorage.setItem("bs_token", token);
      localStorage.setItem("bs_bank_id", String(waste_bank_id));
      nav("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <PageHeader
        kicker="Portal · Bank Sampah"
        title="Masuk Portal"
        subtitle="Login untuk mengelola listing dan harga sampah Anda."
      />
      <form
        onSubmit={submit}
        data-testid="bank-login-form"
        className="rounded border border-border bg-card p-6 space-y-4"
      >
        <div>
          <label className="text-xs font-semibold text-foreground/75">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            data-testid="bank-login-email"
            placeholder="email@banksampah.id"
            className="ds-input mt-1"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-foreground/75">Kata Sandi</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            data-testid="bank-login-password"
            placeholder="••••••••"
            className="ds-input mt-1"
          />
        </div>
        {error && (
          <div className="inline-flex items-center gap-2 text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded px-3 py-2">
            <AlertCircle className="w-4 h-4" /> {error}
          </div>
        )}
        <button
          type="submit"
          disabled={loading}
          data-testid="bank-login-submit"
          className="w-full rounded bg-primary hover:bg-secondary text-primary-foreground font-semibold py-3 text-sm inline-flex items-center justify-center gap-2 disabled:opacity-50 transition-colors"
        >
          <LogIn className="w-4 h-4" />
          {loading ? "Masuk…" : "Masuk"}
        </button>
      </form>

      <div className="mt-4 rounded border border-primary/30 bg-primary/5 p-4 text-sm">
        <div className="font-bold text-primary mb-1">Akun demo</div>
        <p className="text-xs text-foreground/75 leading-relaxed">
          Email: <code className="font-mono text-foreground">melati@banksampah.id</code><br />
          Sandi: <code className="font-mono text-foreground">demo1234</code>
        </p>
      </div>

      <p className="text-xs text-muted-foreground text-center mt-6">
        Belum terdaftar?{" "}
        <Link to="/vendor" data-testid="bank-login-register-info" className="font-semibold text-primary hover:underline">
          Hubungi admin platform
        </Link>{" "}
        untuk pendaftaran.
      </p>
    </div>
  );
}
