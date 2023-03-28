const { electron } = window;

// Create explicit ES6 Module so we can more easily mock and test it
export default { ...electron };
