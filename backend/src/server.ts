import app from './app';
import { env } from './config/env';

const PORT = env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Mini ERP Backend Server running on http://localhost:${PORT}`);
  console.log(`📡 API endpoint base: http://localhost:${PORT}/api/v1`);
});
