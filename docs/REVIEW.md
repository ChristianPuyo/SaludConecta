# Revisión de Código — SaludConecta (Guardian Salud AI)

**Versión:** 1.0.0  
**SDK:** Expo ~54 · React Native 0.81 · React 19.1  
**Idioma:** TypeScript (strict)

---

## Estructura del Proyecto

```
SaludConecta/
├── App.tsx                        # Entry point con providers anidados
├── index.ts                       # Registro raíz (registerRootComponent)
├── app.json                       # Configuración Expo (SDK 54, orientación portrait)
├── package.json                   # Dependencias del proyecto
├── tsconfig.json                  # strict: true
│
├── src/
│   ├── types/
│   │   └── role.ts                # UserRole, RoleOption, ROLE_OPTIONS
│   │
│   ├── theme/
│   │   └── colors.ts              # Paleta de colores centralizada
│   │
│   ├── data/
│   │   └── mockData.ts            # Datos de prueba (reportes, distritos, alertas)
│   │
│   ├── components/
│   │   ├── RiskBadge.tsx           # Badge visual de nivel de riesgo
│   │   └── SwitchRoleButton.tsx    # Botón para cambiar de rol
│   │
│   ├── context/
│   │   ├── RoleContext.tsx         # Persiste rol en AsyncStorage
│   │   ├── ReportsContext.tsx      # Estado global de reportes ciudadanos
│   │   └── VisitsContext.tsx       # Estado global de visitas + sync offline
│   │
│   ├── navigation/
│   │   ├── RootNavigator.tsx       # Navegador raíz (selecciona según rol)
│   │   ├── CitizenNavigator.tsx    # Tabs: Home, ReportSymptoms, MyReports
│   │   ├── AgentNavigator.tsx      # Tabs: Home, RegisterVisit, Sync
│   │   └── AuthorityNavigator.tsx  # Tabs: Dashboard, RiskMap, Alerts
│   │
│   └── screens/
│       ├── RoleSelectorScreen.tsx           # Selección inicial de rol
│       │
│       ├── citizen/
│       │   ├── CitizenHomeScreen.tsx        # Inicio con resumen y riesgo del distrito
│       │   ├── ReportSymptomsScreen.tsx     # Reporte de síntomas + clasificación IA
│       │   └── MyReportsScreen.tsx          # Historial de reportes realizados
│       │
│       ├── agent/
│       │   ├── AgentHomeScreen.tsx          # Panel agente con estadísticas
│       │   ├── RegisterVisitScreen.tsx      # Formulario de visita comunitaria
│       │   └── SyncScreen.tsx               # Lista de visitas y sincronización
│       │
│       └── authority/
│           ├── AuthorityDashboardScreen.tsx # KPIs, barras por distrito, analítica predictiva
│           ├── RiskMapScreen.tsx            # Vista de riesgo por distrito
│           └── AlertsScreen.tsx             # Alertas generadas automáticamente por IA
│
└── docs/
    └── Propuesta mejorada.txt     # Documento conceptual del proyecto
```

---

## Roles del Sistema (3 roles)

| Rol | ID | Descripción |
|-----|----|-------------|
| Ciudadano | `citizen` | Reporta síntomas y recibe alertas |
| Agente Comunitario | `agent` | Registra visitas de salud offline |
| Autoridad / Analista | `authority` | Visualiza dashboard, mapas de riesgo y alertas |

---

## Hallazgos Detallados

### ✅ Aspectos Positivos

| Aspecto | Detalle |
|---------|---------|
| **Arquitectura modular** | Separación clara en types, theme, data, components, context, navigation, screens |
| **TypeScript estricto** | `strict: true` activado, tipados correctos en contexts y navegación |
| **Contextos bien definidos** | `RoleContext`, `ReportsContext`, `VisitsContext` con providers y hooks personalizados |
| **Navegación condicional** | `RootNavigator` renderiza pantalla de login o la app según rol persistido |
| **Tema centralizado** | Colores unificados en `src/theme/colors.ts`, usado en todos los componentes |
| **Estilos consistentes** | Todos los componentes usan `StyleSheet.create` con el mismo patrón |
| **Simulación offline agente** | `VisitsContext` marca visitas como no sincronizadas y permite sync manual |
| **Clasificación de riesgo** | `classifyRisk` en ReportSymptomsScreen asigna riesgo según síntomas + fiebre |
| **Componentes reutilizables** | `RiskBadge` y `SwitchRoleButton` se usan en múltiples pantallas |
| **Versiones modernas** | Expo SDK 54, React Native 0.81, React 19.1, React Navigation 7 |

### ⚠️ Áreas de Mejora

| Área | Problema | Sugerencia |
|------|----------|------------|
| **Persistencia offline real** | Reportes y visitas viven solo en estado React. Se pierden al recargar la app (excepto el rol). | Usar `AsyncStorage` o `expo-sqlite` para persistencia local real. |
| **Sincronización con backend** | `syncAll` en `VisitsContext` usa `setTimeout(1200)` como placeholder. | Conectar a API REST real para enviar datos al servidor. |
| **Riesgo de distrito hardcodeado** | `CitizenHomeScreen` muestra `RiskBadge level="medio"` fijo para Callería. | Obtener nivel de riesgo desde datos dinámicos o contexto global. |
| **Campo no utilizado** | `community` se captura en `ReportSymptomsScreen` pero no se incluye en `addReport`. | Agregar `community` al `SymptomReport` y al `addReport`. |
| **Validación de formularios** | Campos como presión arterial, glucosa, temperatura se capturan como strings sin validar. | Agregar validación de formato y tipos numéricos. |
| **Mapa geoespacial** | `RiskMapScreen` muestra solo una lista de distritos con un placeholder. | Integrar react-native-maps o Mapbox para mapa interactivo real. |
| **Alertas dinámicas** | Las alertas vienen de `MOCK_ALERTS` fijas, no se generan automáticamente. | Implementar lógica de detección de patrones en backend o edge. |
| **Sin tests automatizados** | No hay archivos de prueba (`.test.ts`, `__tests__`). | Agregar tests unitarios con Jest y/o pruebas de componentes con React Native Testing Library. |
| **Manejo de errores en contexts** | No hay manejo de errores en `selectRole` / `clearRole` si AsyncStorage falla. | Agregar try-catch con feedback al usuario. |
| **Accesibilidad** | No se usan propiedades de accesibilidad (`accessibilityLabel`, `role`, etc.). | Agregar atributos de accesibilidad para cumplir con estándares. |

---

## Flujo de la Aplicación

```
Inicio
  │
  └── RoleSelectorScreen
        │
        ├── Ciudadano ──── CitizenNavigator ──── Home / ReportSymptoms / MyReports
        │
        ├── Agente ─────── AgentNavigator ────── Home / RegisterVisit / Sync
        │
        └── Autoridad ──── AuthorityNavigator ── Dashboard / RiskMap / Alerts
```

---

## Dependencias Principales

| Paquete | Versión | Uso |
|---------|---------|-----|
| expo | ~54.0.34 | Plataforma |
| react-native | 0.81.5 | UI nativa |
| react | 19.1.0 | Librería UI |
| @react-navigation/native | ^7.3.8 | Navegación |
| @react-navigation/native-stack | ^7.17.10 | Stack navigator |
| @react-navigation/bottom-tabs | ^7.18.8 | Bottom tabs |
| @react-native-async-storage/async-storage | 2.2.0 | Persistencia local |
| @expo/vector-icons | ^15.0.3 | Iconos Ionicons |

---

## Resumen Final

| Dimensión | Evaluación |
|-----------|------------|
| Estructura y organización | ✅ Excelente |
| Tipado y seguridad | ✅ Bueno |
| UI/UX y consistencia visual | ✅ Bueno |
| Navegación y flujo | ✅ Correcto |
| Manejo de estado | ✅ Correcto |
| Persistencia de datos | ⚠️ Parcial (solo rol) |
| Conexión a backend | ❌ No implementada |
| Mapas y geoespacial | ❌ Placeholder |
| Tests automatizados | ❌ No implementados |
| Modo offline real | ⚠️ Simulado, no persistente |

**Conclusión:** El proyecto es un MVP funcional, bien estructurado y con código limpio. La arquitectura basada en contexts y la navegación por roles es sólida. Las principales deudas técnicas son la persistencia offline real, la conexión a un backend y los tests automatizados.
