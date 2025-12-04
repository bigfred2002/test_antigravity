import React from 'react';

const VisitEntry = () => {
    return (
        <div className="visit-entry">
            <form className="visit-form">
                <div className="form-group">
                    <label>Date de visite</label>
                    <input type="date" />
                </div>
                <div className="form-group">
                    <label>Ruche</label>
                    <select>
                        <option>Ruche #1</option>
                        <option>Ruche #2</option>
                    </select>
                </div>
                <button type="submit" className="btn-primary">Enregistrer</button>
            </form>
        </div>
    );
};

export default VisitEntry;
