import { useState } from 'react';

export function SettingsPanel({ apiKey, onSave, onClose }) {
  const [key, setKey] = useState(apiKey ?? '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(key.trim());
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal--settings" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <div className="modal-body">
          <h2 className="modal-title">Paramètres</h2>
          <p className="settings-desc">
            Pour afficher de vrais événements en France, entrez votre clé API{' '}
            <a href="https://openagenda.com/settings" target="_blank" rel="noopener noreferrer">
              OpenAgenda
            </a>{' '}
            (gratuite). Sans clé, l'application fonctionne en mode démo.
          </p>
          <form onSubmit={handleSubmit} className="settings-form">
            <label htmlFor="apikey">Clé API OpenAgenda</label>
            <input
              id="apikey"
              type="text"
              placeholder="Ex: abcDef123..."
              value={key}
              onChange={(e) => setKey(e.target.value)}
            />
            <div className="settings-actions">
              {key && (
                <button type="button" className="btn btn--ghost" onClick={() => { setKey(''); onSave(''); onClose(); }}>
                  Supprimer la clé
                </button>
              )}
              <button type="submit" className="btn btn--primary">Enregistrer</button>
            </div>
          </form>
          <p className="settings-note">La clé est stockée uniquement dans votre navigateur (localStorage).</p>
        </div>
      </div>
    </div>
  );
}
