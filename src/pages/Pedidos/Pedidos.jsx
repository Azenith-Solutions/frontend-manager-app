import React from "react";
import { useEffect, useState } from "react";
import SearchAndImportBar from "../../components/SearchAndImportBar/SearchAndImportBar";
import { DataGridComponent } from "../../components/DataGrid/DataGrid";
import Toggle from "../../components/Buttons/Toggle/Toggle";
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditSquareIcon from '@mui/icons-material/EditSquare';
// import { data } from "react-router-dom";

const Pedidos = () => {
  useEffect(() => {
    document.title = "HardwareTech | Pedidos";
  }, []);

  const [labels, setLabels] = useState([]);
  const [cardsByLabel, setCardsByLabel] = useState([]);
  const [listsOfCards, setListsOfCards] = useState([]);

  const boardId = "*****"; // Replace with actual HardwareTech board ID

  async function getAllLabels() {
    console.log("Fetching Labels...");

    const response = await fetch(`http://localhost:8080/api/trello/labels?boardId=${boardId}`);
    const labels = await response.json();

    setLabels(labels);
  }

  async function getCardsByLabel() {
    const response = await fetch(`http://localhost:8080/api/trello/labels?boardId=${boardId}`);
    const labels = await response.json();
    const labelId = labels[0].id;

    const cardsResponse = await fetch(`http://localhost:8080/api/trello/cards?boardId=${boardId}&labelId=${labelId}`);
    const cardsByLabel = await cardsResponse.json();

    setCardsByLabel(cardsByLabel);
  }

  async function getListsOfCards() {
    console.log("Fetching Lists of Cards...");

    const response = await fetch(`http://localhost:8080/api/trello/listsOfCards?boardId=${boardId}`);
    const listsOfCards = await response.json();

    console.log(listsOfCards);

    setListsOfCards(listsOfCards);
  }

  return (
    <>
      <div>
        <button onClick={getAllLabels}>Buscar Etiquetas</button>

        <br /> <br />

        <ul>
          {labels.map((label) => (
            <>
              <p key={label.id}>
                <strong>{"ID da Etiqueta: " + label.id}</strong> <br />
                <strong>{"Título da Etiqueta:" + label.name}</strong> <br /><br />
              </p> <br /> <br />
            </>
          ))}
        </ul>
      </div>

      <div>
        <br /> <br />
        <br /> <br />

        <button onClick={getCardsByLabel}>Buscar Cartões por Etiqueta</button>

        <br /> <br />

        <ul>
          {cardsByLabel.map((card) => (
            <>
              <p key={card.id}>
                <strong>{"ID do Cartão: " + card.id}</strong> <br />
                <strong>{"Nome do Cartão:" + card.name}</strong> <br /><br />
                <strong>{"URL:" + card.url}</strong> <br /><br />
                <strong>{"ID(s) da(s) Etiqueta(s):" + card.idLabels}</strong> <br />
              </p >
            </>
          ))}
        </ul>
      </div>

      <div>
        <br /> <br />
        <br /> <br />

        <button onClick={getListsOfCards}>Buscar Listas de Cartões</button>

        <br /> <br />

        <ul>
          {listsOfCards.map((list) => (
            <>
              <p key={list.id}>
                <strong>{"ID da Lista: " + list.id}</strong> <br />
                <strong>{"Nome da Lista:" + list.name}</strong> <br /><br />
              </p>

              <br /> <br />
            </>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Pedidos;