const express = require('express');
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

const authRouter = require('./routes/auth');
const packageRouter = require('./routes/package');

app.get('/', (req, res) => {
  res.json({ message: 'alive' });
});

app.use('/auth', authRouter);
app.use('/package', packageRouter);

app.listen(PORT, () => {
  console.log('Server listening on PORT:', PORT);
});
