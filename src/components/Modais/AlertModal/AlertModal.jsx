import React from "react";
import "./AlertModal.css";
import AlertIcon from "../../../assets/icons/icon-warning.svg";

const AlertModal = () => {
  function updateModalState() {
    const modal = document.querySelector(".container-modal");
    modal.style.display = "none";
  }

  return (
    <div className="container-modal">
      <div className="content-modal">
        <button className="top-close-button" onClick={updateModalState}>
          ✖
        </button>

        <img src={AlertIcon} alt="Icone de alerta" />
        <h2 id="titleModal">Título do Modal</h2>

        <p id="descriptionModal">Descrição do conteúdo do modal.</p>

        <button className="bottom-close-button" onClick={updateModalState}>
          Fechar
        </button>
      </div>
    </div>
  );
};

export default AlertModal;
