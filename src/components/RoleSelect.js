const RoleSelect = ({ setRole }) => {
    return (
        <div className="role-select">
            <div className="role-select__container">
                <h2>ACCESS_SELECTION</h2>
                <p style={{ color: '#a0a0a0', marginBottom: '20px' }}>Identify user protocol to continue.</p>
                <div className="role-select__buttons">
                    <div className="role-card" onClick={() => setRole('buyer')}>
                        <h3>> BUYER_MODE</h3>
                        <p>Rent available computational power.</p>
                    </div>
                    <div className="role-card" onClick={() => setRole('seller')}>
                        <h3>> SELLER_MODE</h3>
                        <p>Deploy and list local resources.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RoleSelect;
