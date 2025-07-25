# 🏠 FLUJO COMPLETO HOMELINK - SISTEMA DE COMPRAS

## 📋 **ESTRUCTURA DE LA BASE DE DATOS**

### **TABLAS PRINCIPALES:**
1. **`usuarios`** - Información de usuarios registrados
2. **`productos`** - Catálogo de routers VPN
3. **`compras`** - Registro de compras realizadas
4. **`detalle_compras`** - Productos específicos de cada compra
5. **`metodos_pago`** - Métodos de pago disponibles
6. **`pagos`** - Registro de pagos (futuro)

### **TABLAS ADICIONALES:**
- `dispositivos` - Dispositivos de usuarios
- `redes` - Redes WiFi configuradas
- `conexion_vpn` - Configuraciones VPN
- `configuraciones` - Configuraciones del sistema
- `usuario_redes` - Relación usuarios-redes

---

## 🔄 **FLUJO COMPLETO DE COMPRA**

### **1. REGISTRO/LOGIN DE USUARIO**
```
Frontend → POST /registro o /login → Backend → Tabla 'usuarios'
```
- Usuario se registra o inicia sesión
- Se almacena en tabla `usuarios`
- Sesión se guarda en localStorage del frontend

### **2. NAVEGACIÓN Y SELECCIÓN DE PRODUCTOS**
```
Usuario → router.html → Agregar al carrito → localStorage
```
- Usuario navega a `router.html`
- Ve productos disponibles (4 routers VPN)
- Agrega productos al carrito (almacenado en localStorage)

### **3. PROCESO DE COMPRA**
```
Carrito → Medio de pago.HTML → Formulario → POST /comprar
```

**Datos enviados:**
```javascript
{
  userSession: { email: "usuario@email.com", isLoggedIn: true },
  cart: [
    { name: "ASUS RT-AC86U", price: 199.99, quantity: 1 }
  ],
  datos: {
    persona: "natural",
    banco: "bancolombia",
    nombres: "ESTEBAN MANUEL",
    apellidos: "LOPEZ RIVERO",
    correo: "studiootaku6@gmail.com",
    tipo_id: "CC",
    documento: "1062604753",
    celular: "3017400553"
  }
}
```

### **4. PROCESAMIENTO EN BACKEND**
```
POST /comprar → routes/compras.js → Base de datos
```

**Pasos del backend:**
1. **Validar sesión** - Verificar que el usuario esté logueado
2. **Buscar usuario** - Obtener `id_usuario` por email
3. **Calcular total** - Sumar precios del carrito
4. **Insertar compra** - Crear registro en tabla `compras`
5. **Insertar detalles** - Para cada producto:
   - Buscar `id_producto` por nombre en tabla `productos`
   - Insertar en tabla `detalle_compras`

### **5. VISUALIZACIÓN DE COMPRAS**
```
mis compras.HTML → POST /miscompras → Mostrar compras
```

**Consulta del backend:**
```sql
SELECT c.id_compra, c.total, c.fecha, c.detalles
FROM compras c
JOIN usuarios u ON c.id_usuario = u.id_usuario
WHERE u.correo = ?
ORDER BY c.fecha DESC
```

---

## 🛠️ **CONFIGURACIÓN NECESARIA**

### **1. BASE DE DATOS**
Ejecutar el script: `setup_completo_homelink.sql`

### **2. SERVIDOR NODE.JS**
```javascript
// server.js debe incluir:
app.use(require('./routes/compras'));
```

### **3. PRODUCTOS DISPONIBLES**
| ID | Nombre | Precio | Stock |
|----|--------|--------|-------|
| 1 | ASUS RT-AC86U | $199.99 | 10 |
| 2 | TP-Link Archer C2300 | $179.99 | 15 |
| 3 | Cudy WR3000E | $179.99 | 20 |
| 4 | Netgear X4S D7800 | $249.99 | 5 |

---

## 🔍 **VERIFICACIÓN DEL SISTEMA**

### **1. Verificar Base de Datos**
```sql
-- Verificar productos
SELECT * FROM productos;

-- Verificar usuario
SELECT * FROM usuarios WHERE correo = 'studiootaku6@gmail.com';

-- Verificar compras (después de una compra)
SELECT * FROM compras ORDER BY fecha DESC;

-- Verificar detalles de compra
SELECT c.id_compra, c.total, c.fecha, p.nombre, d.cantidad, d.precio_unit
FROM compras c
JOIN detalle_compras d ON c.id_compra = d.id_compra
JOIN productos p ON d.id_producto = p.id_producto
ORDER BY c.fecha DESC;
```

### **2. Verificar Servidor**
```bash
# El servidor debe mostrar:
Servidor escuchando en puerto 3000
🔸 POST /comprar { userSession: {...}, cart: [...], datos: {...} }
🔸 POST /miscompras { userSession: {...} }
```

### **3. Verificar Frontend**
- Login funcional
- Carrito guarda productos
- Pago procesa correctamente
- Mis compras muestra las compras

---

## 🚨 **POSIBLES PROBLEMAS Y SOLUCIONES**

### **Problema: "Producto no encontrado"**
**Causa:** Los nombres de productos no coinciden exactamente
**Solución:** Verificar que los nombres en `router.html` coincidan con `productos.nombre`

### **Problema: "Usuario no encontrado"**
**Causa:** El email no existe en la base de datos
**Solución:** Verificar que el usuario esté registrado en tabla `usuarios`

### **Problema: "Error al guardar compra"**
**Causa:** Problema de conexión o estructura de base de datos
**Solución:** Verificar conexión y ejecutar script de configuración

### **Problema: "Mis compras vacío"**
**Causa:** No hay compras registradas o error en consulta
**Solución:** Verificar que las compras se guarden correctamente

---

## 📱 **PÁGINAS DEL SISTEMA**

1. **`servicio.html`** - Página principal
2. **`router.html`** - Catálogo de productos
3. **`mi carrito.html`** - Gestión del carrito
4. **`Medio de pago.HTML`** - Proceso de pago
5. **`mis compras.html`** - Historial de compras
6. **`login.html`** - Inicio de sesión
7. **`registro.html`** - Registro de usuarios

---

## ✅ **ESTADO ACTUAL DEL SISTEMA**

- ✅ Base de datos configurada
- ✅ Backend con rutas de compras
- ✅ Frontend con flujo completo
- ✅ Sistema de autenticación
- ✅ Carrito funcional
- ✅ Proceso de pago
- ✅ Visualización de compras

**El sistema está listo para funcionar completamente.** 