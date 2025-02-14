// Predefined panel efficiency and capacity
const panelTypes = {
    "Monocrystalline": { efficiency: 0.20, capacity: 350 },
    "Polycrystalline": { efficiency: 0.16, capacity: 300 },
    "Thin-Film": { efficiency: 0.12, capacity: 200 }
};

const getPanelEfficiencyCapacity = (panel_type) => {
    if (!panelTypes[panel_type]) {
        throw new Error("Invalid panel type. Choose from Monocrystalline, Polycrystalline, or Thin-Film.");
    }

    // ([]) is needed because panel_type is a variable.
    return panelTypes[panel_type]; // Returns { efficiency, capacity }
};

module.exports = getPanelEfficiencyCapacity;
