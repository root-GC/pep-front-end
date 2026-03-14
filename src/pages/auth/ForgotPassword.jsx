import React, { useState } from "react";
import styles from "./css/ForgotPassword.module.css";
import { Link } from "react-router-dom";
import api from "../../api/api";

const ForgotPassword = () => {

     const [email, setEmail] = useState("");
     const [message, setMessage] = useState("");

     const handleSubmit = async (e) => {

          e.preventDefault();

          try {

               await api.post("/auth/recover", { email });

               setMessage("Link de recuperação enviado para o seu email.");

          } catch (error) {

               console.error(error);

               setMessage("Não foi possível enviar o email.");

          }

     };

     return (

          <div className={styles.page}>
               <div className={styles.container}>
                    <div className={styles.card}>

                         <div className={styles.cardBody}>

                              <div className={styles.logoContainer}>
                                   <div className={styles.logoIcon}>
                                        <span className="material-symbols-outlined">school</span>
                                   </div>

                                   <h2 className={styles.logoTitle}>
                                        Sistema PEP
                                   </h2>

                                   <div className={styles.logoUnderline}></div>

                              </div>

                              <h1 className={styles.title}>
                                   Recuperar Senha
                              </h1>

                              <p className={styles.subtitle}>
                                   Insira o seu e-mail institucional para receber um link.
                              </p>

                              <form onSubmit={handleSubmit} className={styles.form}>

                                   <div className={styles.inputGroup}>

                                        <label className={styles.label}>
                                             E-mail Institucional
                                        </label>

                                        <div className={styles.inputWrapper}>

                                             <span className={`material-symbols-outlined ${styles.inputIcon}`}>
                                                  mail
                                             </span>

                                             <input
                                                  type="email"
                                                  className={styles.input}
                                                  placeholder="exemplo@instituicao.pt"
                                                  value={email}
                                                  onChange={(e) => setEmail(e.target.value)}
                                                  required
                                             />

                                        </div>
                                   </div>

                                   <div className={styles.buttonGroup}>

                                        <button
                                             type="submit"
                                             className={styles.submitButton}
                                        >

                                             Enviar Link

                                        </button>

                                        <Link
                                             to="/login"
                                             className={styles.backLink}
                                        >

                                             <span className="material-symbols-outlined">
                                                  arrow_back
                                             </span>

                                             Voltar ao Login

                                        </Link>

                                   </div>

                              </form>

                              {message && <p style={{ marginTop: "10px" }}>{message}</p>}

                         </div>

                         <div className={styles.cardFooter}>
                              <p className={styles.footerText}>
                                   © 2026 PEP Estágios
                              </p>
                         </div>

                    </div>
               </div>
          </div>

     )

}

export default ForgotPassword;