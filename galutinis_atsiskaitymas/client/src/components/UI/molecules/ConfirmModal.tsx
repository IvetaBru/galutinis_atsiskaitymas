import styled from "styled-components";

type ConfirmModalProps = {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  message?: string;
};

const StyledModal = styled.div`
    position: fixed;
    inset: 0;
    background-color: #0000003e;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    .container{
        background: var(--color-primary);
        padding: 24px;
        border-radius: 40px;
        box-shadow: 0 6px 12px var(--color-secondary);
        width: 320px;
        max-width: 90%;
        text-align: center;
    }
    .buttons{
        display: flex;
        justify-content: center;
        gap: 50px;
    }
    .button{
        background-color: var(--color-background);            
        border: none;
        border-radius: 12px;
        padding: 5px 20px;
        font-family: "Nunito", sans-serif;
        font-weight: 600;
        cursor: pointer;
        box-shadow: 0 1px 2px var(--color-secondary);
    }
    .button:hover{
        background-color: var(--color-accent);
    }
`

const ConfirmModal = ({ isOpen, onConfirm, onCancel, message }: ConfirmModalProps) => {
  if (!isOpen) return null;

  return (
    <StyledModal>
      <div className="container">
        <p>{message || "Are you sure?"}</p>
        <div className="buttons">
          <button onClick={onCancel} className="button">Cancel</button>
          <button onClick={onConfirm} className="button">Delete</button>
        </div>
      </div>
    </StyledModal>
  );
};

export default ConfirmModal;