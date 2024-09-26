const router = require('express').Router();
const path = require('path');
const axios = require('axios');

// Serve the index.html file for the root route
router.get('/', (req, res) => res.sendFile(path.join(__dirname, '../views/index.html')));

router.post('/controlid', async (req, res) => {
  console.log(req);
  const { host, login, password } = req.body;

  if (!host || !login || !password) {
    return res.status(400).json({ msg: 'Dados inválidos' });
  }

  try {
    // Primeiro faz o login e obtém a sessão
    const loginResponse = await axios.post(`${host}/login.fcgi`, { login, password });
    const session = loginResponse.data.session;

    // Agora executa a ação com a sessão obtida
    const actionsResponse = await axios.post(`${host}/execute_actions.fcgi?session=${session}`, {
      actions: [
        {
          action: "sec_box",
          parameters: "id=65793, reason=3"
        }
      ]
    });

    // Retorna os dados da resposta da segunda requisição
    return res.json(actionsResponse.data);

  } catch (error) {
    console.error(error);
    return res.status(400).json({ msg: 'Erro ao conectar com o ControlID ou ao buscar logs' });
  }
});

module.exports = router;
