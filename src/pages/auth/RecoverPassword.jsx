import React, { useState } from "react";
import styles from "./css/RecoverPassword.module.css";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import api from "../../api/api";

const RecoverPassword = () => {

  const navigate = useNavigate();
  const [params] = useSearchParams();

  const token = params.get("token");
  const email = params.get("email");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");

  const requirements = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    symbol: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password),
  };

  const allRequirementsMet = Object.values(requirements).every(Boolean);

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!allRequirementsMet) {
      setError("A senha não atende todos os requisitos.");
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    try {

      await api.post("/auth/reset-password", {
        email,
        token,
        password,
        password_confirmation: confirmPassword
      });

      alert("Senha redefinida com sucesso");

      navigate("/login");

    } catch (err) {

      console.error(err);
      setError("Erro ao redefinir senha.");

    }

  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>

        <div className={styles.logoSection}>
          <div className={styles.logoIcon}>
            <span className="material-symbols-outlined">school</span>
          </div>
          <div>
            <h2 className={styles.logoTitle}>PEP Estágios</h2>
            <p className={styles.logoSubtitle}>
              Sistema de Gestão de Práticas e Estágios Profissionalizantes
            </p>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardBody}>

            <div className={styles.header}>
              <h1 className={styles.title}>Redefinir Senha</h1>
              <p className={styles.subtitle}>
                Escolha uma senha forte para garantir a segurança da sua conta.
              </p>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>

              {/* Password */}
              <div className={styles.field}>
                <label className={styles.label}>Nova Senha</label>

                <div className={styles.inputWrapper}>

                  <span className={`material-symbols-outlined ${styles.inputIcon}`}>
                    lock
                  </span>

                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={styles.input}
                    placeholder="Digite sua nova senha"
                  />

                  <button
                    type="button"
                    className={styles.visibilityButton}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <span className="material-symbols-outlined">
                      {showPassword ? "visibility_off" : "visibility"}
                    </span>
                  </button>

                </div>
              </div>

              {/* Confirm password */}
              <div className={styles.field}>
                <label className={styles.label}>Confirmar Nova Senha</label>

                <div className={styles.inputWrapper}>

                  <span className={`material-symbols-outlined ${styles.inputIcon}`}>
                    lock_reset
                  </span>

                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={styles.input}
                    placeholder="Confirme sua nova senha"
                  />

                  <button
                    type="button"
                    className={styles.visibilityButton}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <span className="material-symbols-outlined">
                      {showConfirmPassword ? "visibility_off" : "visibility"}
                    </span>
                  </button>

                </div>
              </div>

              {/* Requirements */}
              <div className={styles.requirementsBox}>

                <p className={styles.requirementsTitle}>
                  Requisitos da senha:
                </p>

                <ul className={styles.requirementsList}>

                  <li className={requirements.length ? styles.requirementMet : styles.requirement}>
                    8+ caracteres
                  </li>

                  <li className={requirements.uppercase ? styles.requirementMet : styles.requirement}>
                    Letra maiúscula
                  </li>

                  <li className={requirements.number ? styles.requirementMet : styles.requirement}>
                    Número
                  </li>

                  <li className={requirements.symbol ? styles.requirementMet : styles.requirement}>
                    Símbolo
                  </li>

                </ul>

              </div>

              {error && (
                <div className={styles.errorMessage}>
                  {error}
                </div>
              )}

              <button type="submit" className={styles.submitButton}>
                Redefinir Senha
              </button>

            </form>

          </div>

          <div className={styles.cardFooter}>
            <Link to="/login" className={styles.backLink}>
              <span className="material-symbols-outlined">arrow_back</span>
              Voltar para o Login
            </Link>
          </div>

        </div>

        <p className={styles.footer}>
          © 2026 PEP Estágios
        </p>

      </div>
    </div>
  );

};

export default RecoverPassword;