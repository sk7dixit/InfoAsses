import app from './app';
import { env } from './config/env';

const PORT = Number(process.env.PORT || env.PORT || 5000);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Mini ERP Backend Server running on port ${PORT}`);
  console.log(`📡 API endpoint base path: /api/v1`);
});
