// lib/data/changelog.js — Historial de actualizaciones del bot

export const CHANGELOG_DATA = [
  {
    date: "AGOSTO 2026 - PARTE 3",
    title: "📢 Nuevos Modos de Juego y Nuevo Lobo Kamikaze",
    sections: [
      {
        heading: "💣 NUEVO ROL: LOBO KAMIKAZE", items: [
          "Más información con el comando <code>,ww role lobo kamikaze</code>."
        ]
      },
      { heading: "🌟 NUEVOS MODOS DE JUEGO", items: [
        "<strong>Cuatro nuevos modos de juego</strong>, toda la información acerca de estos con el comando <code>,ww info [mode]</code>",
        "<strong>10 nuevos logros</strong> para acompañar estos modos de juego, página 6 del comando <code>,ww logros</code>",
        "Se han eliminado los comandos <code>,ww pts</code> y <code>,ww niveles</code> y se ha habilitado el comando <code>,ww config</code>."
      ] },
      { heading: "📊 ESTADÍSTICAS Y PANEL WEB", items: [
        "<strong>📊 Rendimiento por Modo en Stats:</strong> Añadida una nueva sección interactiva en tu perfil de estadísticas web que muestra las partidas jugadas, victorias y winrate en cada modo de juego, incluyendo el clásico.",
        "<strong>📈 Partidas por Modo en Servidor:</strong> En la pestaña de resumen de cada servidor, ahora se visualiza el reparto total de partidas disputadas en cada modalidad de juego.",
        "<strong>🏆 Paginación de Logros:</strong> El visor de logros del panel web y la documentación ahora admiten la sexta pestaña para la nueva Categoría de Modos Especiales.",
      ] }
    ]
  },
  {
    date: "AGOSTO 2026 - PARTE 2",
    title: "📢 Actualización de Agosto 2.0 — Logros, Eventos, Roles y Modo Pausado",
    sections: [
      { heading: "🌟 NUEVAS CARACTERÍSTICAS", items: [
        "<strong>🎉 Evento Especial de Celebración:</strong> ¡Para celebrar el lanzamiento de esta gran actualización, habrá 72 horas de Doble XP (2x XP) activas para todos los jugadores en todas las partidas! Además, ¡los 3 jugadores que más XP consigan durante estas 72 horas se llevarán 1.000 XP de AmariBot cada uno! Consulta el ranking con <code>,ww lb event</code>",
        "<strong>📊 Nueva Clasificación Semanal:</strong> Recompensas semanales a los mejores jugadores. Consulta el ranking con <code>,ww lb weekly</code>",
        "<strong>🏆 Sistema de 50 Logros (WWP):</strong> Implementados 50 logros repartidos en 5 categorías (Partidas, Rachas/Supervivencia, Roles de Aldea, Lobos/Independientes y Hazañas Especiales). Cada logro otorga puntos de XP al completarlo. Progreso disponible con el comando <code>,ww logros</code>",
        "Para reclamar los logros completados previamente usa el comando <code>,ww logros</code>",
      ] },
      { heading: "📜 NUEVO ROL: HEREJE", items: [
        "<strong>📜 Hereje - Revelaciones Dicotómicas:</strong> Se han añadido dos afirmaciones únicas para el Hereje que le darán información clave. Con cuidado, una de ellas será falsa. Más información sobre el rol con el comando <code>,ww role hereje</code>",
      ] },
      { heading: "⏱️ NUEVO MODO: PARTIDA PAUSADA", items: [
        "<strong>⏱️ Partida Pausada:</strong> Se ha implementado un nuevo modo de juego pausado. En este modo, cada jugador vivo tendrá su propio turno individual de 15 segundos para hablar. Durante estos turnos, los jugadores pueden decir lo que deseen en el canal. Solo el jugador activo en ese momento podrá escribir. Una vez finalizado el turno del jugador, se le removerá el permiso de escritura y el siguiente jugador tendrá su turno. La duración de la discusión también será personal para cada jugador. Este modo se puede iniciar con el flag `slow` en el comando de inicio: <code>,ww start slow</code>",
      ] }
    ]
  },
  {
    date: "AGOSTO 2026",
    title: "📢 Actualización de Agosto — Sistema de XP y Panel Web",
    sections: [
      { heading: "🌟 NUEVAS CARACTERÍSTICAS", items: [
        "<strong>📈 Sistema de Niveles y XP:</strong> ¡Ahora tienes niveles en Werewolf! Tu nivel se calcula automáticamente a partir de tu XP con la fórmula <code>Nivel = 1 + sqrt(XP / 20)</code>.",
        "<strong>🎖️ Roles por Nivel (Exclusivos):</strong> Se ha eliminado el antiguo sistema de logros por victorias. Ahora los servidores otorgan roles automáticos según tu nivel. Al subir de nivel se te asignará el rol nuevo y se retirará el anterior (asignación exclusiva). Modificable por los administradores desde el panel web.",
        "<strong>🎗️ Comando <code>,ww niveles</code> / <code>/ww niveles</code>:</strong> Nuevo comando público para ver el progreso actual, tu nivel, XP acumulada y la lista de rangos por nivel configurados.",
        "<strong>🎗️ Comando <code>,ww pts</code> / <code>/ww pts</code>:</strong> Nuevo comando público para consultar de forma interactiva la XP asignada por cada acción de la partida (victorias, rondas sobrevividas, etc.).",
        "<strong>🛡️ Blacklist de Werewolf en la Web:</strong> Añadida una nueva sección en el Panel de Administración de la Web para gestionar usuarios en la lista negra (ver, añadir y eliminar con doble confirmación) de forma segura y automatizada.",
        "<strong>📊 Niveles en Stats:</strong> Los comandos <code>,ww stats</code> y <code>/ww stats</code> ahora muestran tu nivel de XP actual y se actualizan al instante.",
      ] },
      { heading: "⚖️ CAMBIOS DE BALANCE", items: [
        "<strong>🔮 Hechicera (7 y 8 jugadores):</strong> El rol Hechicera ya no aparece en partidas de menos de 9 jugadores (máximo de 2 lobos).",
        "<strong>🔮 Hechicera (9 jugadores):</strong> Ahora en partidas de 9 jugadores siempre hay 2 lobos de base, y además puede aparecer una Hechicera (haciendo un total de 3 lobos). Si se activa, se garantiza que haya un Vidente en la aldea.",
      ] },
      { heading: "🐛 CORRECCIÓN DE ERRORES Y MEJORAS", items: [
        "<strong>📈 Posición de Ranking Web:</strong> Corregido el fallo de consulta que mostraba a todos en la posición #1 del ranking en la web.",
        "<strong>🏆 Comando <code>,ww wr</code> (Win Rates):</strong> Corregido el comando de porcentaje de victorias global para que cargue y guarde de forma correcta las estadísticas específicas de cada servidor por separado.",
        "<strong>📖 Ayuda e Información (<code>,ww info</code> y <code>,ww help</code>):</strong> Rediseñado el comando informativo para explicar el funcionamiento de los niveles, logros y listar adecuadamente los nuevos comandos de estadísticas."
      ] }
    ]
  },
  {
    date: "JULIO 2026",
    title: "📢 Actualización de Julio — Mejoras y Correcciones",
    sections: [
      { heading: "⚙️ CAMBIOS Y MEJORAS", items: [
        "<strong>🗣️ Tiempo de Discusión:</strong> El bot ahora enviará un aviso cuando queden 10 segundos de discusión antes del cierre de líneas.",
        "<strong>🌙 Información Nocturna:</strong> Se muestra claramente el número de jugadores que quedan vivos al inicio de cada noche.",
        "<strong>💀 Muerte del Infiel:</strong> Corregido el mensaje de muerte del Infiel al acostarse con un lobo para que especifique la causa (VIH).",
      ] },
      { heading: "🐛 CORRECCIÓN DE ERRORES", items: [
        "<strong>🏠 Infiel:</strong> Corregido el bug donde la Bruja lo veía como atacado si los lobos iban a su casa pero él dormía fuera.",
        "<strong>💋 Ramera:</strong> Corregido el bug donde la Bruja lo veía como atacado si los lobos iban a su casa pero él dormía fuera.",
        "<strong>🐺 Licántropo:</strong> Solucionado el bug que permitía la aparición de un Licántropo en partidas sin Vidente.",
      ] }
    ]
  },
  {
    date: "JUNIO 2026",
    title: "📢 Actualización de Junio — Sistema de Eventos",
    sections: [
      { heading: "🏆 SISTEMA DE XP", items: [
        "<strong>⏱️ XP por ronda:</strong> +2 XP por cada ronda aguantada con vida.",
        "<strong>🏆 XP por victoria:</strong> +15 XP a cada miembro del equipo ganador (Aldea o Lobos).",
        "<strong>❤️/💖 Victoria Solitaria o Enamorados:</strong> +50 XP extra por ganar la partida como Solitario o Amantes.",
        "<strong>❤️ Supervivencia final:</strong> +5 XP extra si finalizas la partida con vida.",
        "<strong>🥇 Tabla de Clasificación:</strong> Nuevo comando <code>,ww lb</code> / <code>/ww lb</code> para consultar los Top 10 jugadores.",
        "<strong>📊 XP en Stats:</strong> El comando <code>,ww stats</code> ahora muestra la XP acumulada.",
        "<strong>🛠️ Reset de XP:</strong> Comando <code>,ww resetlb</code> para que admins y owners reinicien la clasificación.",
      ] },
      { heading: "⚙️ CAMBIOS DE EQUILIBRIO Y ROLES", items: [
        "<strong>🦴 Gran Lobo Feroz:</strong> Su habilidad para matar a una 2ª víctima en solitario solo se activa en <strong>noches pares</strong>.",
        "<strong>💋 Ramera:</strong> Su visita a los lobos solo cancela la cacería si se acuesta con el <strong>lobo decisor</strong>.",
        "<strong>🔮 Presets de 5 Jugadores:</strong> En partidas de 5 jugadores, si hay <strong>Vidente</strong>, no habrá <strong>Bruja</strong>.",
      ] },
      { heading: "🐛 CORRECCIÓN DE ERRORES", items: [
        "<strong>🎭 Ladrón:</strong> Corregido un error que limitaba las cartas del centro a 2. Ahora puede ver y elegir entre todas las cartas generadas (entre 2 y 4).",
      ] }
    ]
  },
  {
    date: "ABRIL 2026",
    title: "📢 Gran Actualización de Abril",
    sections: [
      { heading: "✨ NUEVO", items: [
        "<strong>🌐 Página Web:</strong> ¡Ya tenemos documentación oficial! Contiene normas, información detallada sobre roles, presets, registro de actualizaciones y logros.",
        "<strong>🎲 Nuevo Sistema de Presets:</strong> Se acabó la generación de roles pre-establecidos. Ahora se calculan en base a una probabilidad (<em>spawn rate</em>) que depende del número de jugadores. Tienes toda la info con <code>/ww presets</code>.",
        "<strong>🎭 Rol JUEZ 👩🏼‍⚖️:</strong> Nuevo rol disponible en partidas de +10 jugadores. Toda la información con <code>/ww role Juez</code>.",
        "<strong>🎭 Rol MIRÓN 🥷🏼:</strong> Nuevo rol disponible en partidas de +10 jugadores. <em>Nota: En partidas de menos de 15 jugadores, no podrá haber Vidente y Mirón simultáneamente.</em> Info con <code>/ww role Miron</code>.",
        "<strong>🏆 Logro Amantes:</strong> Nuevo rol de recompensa por obtener tu primera victoria como amantes (no es evolutivo, solo requiere 1 victoria).",
        "<strong>🛡️ Sistema de Reportes:</strong> Añadido el comando <code>,ww report [@user] [motivo]</code> para denunciar a jugadores que incumplan las normas del minijuego.",
      ] },
      { heading: "⚙️ CAMBIOS Y AJUSTES", items: [
        "<strong>📊 Estadísticas y Comandos de WR:</strong><ul><li>Los porcentajes de <em>Win Rate</em> ahora son correctos y llevan el conteo exacto de partidas jugadas.</li><li>Ahora se contabilizan las victorias obtenidas como amantes.</li><li>Al ser infectado por el Padre de los Lobos (o si muere el ídolo del Niño Salvaje), las estadísticas de victoria/derrota se guardarán correctamente como si pertenecieses al bando de los lobos.</li></ul>",
        "<strong>🎮 Comando de Inicio:</strong> Usar <code>,ww start</code> sin argumentos iniciará la partida automáticamente con <code>time = 300</code> y votaciones anónimas.",
        "<strong>🔇 Mute de Muertos:</strong> Los jugadores muertos ya no podrán enviar mensajes al canal hasta que finalice la partida por completo.",
        "<strong>🔔 Menciones del Minijuego:</strong> Ya no se puede hacer <em>ping</em> directo al rol. Se debe usar el comando <code>,ww mention [msg]</code> (exclusivo para quienes tengan el rol y con un cooldown de 15 minutos).",
        "<strong>🐺 Padre de los Lobos:</strong> Ya no puede infectar al Alma Pura.",
        "<strong>🦹‍ Ladrón:</strong> Ahora podrá tener hasta 4 roles para elegir al azar.",
        "<strong>🏅 Logros Lobo Blanco y Curtidor:</strong> Se ha reducido el número de victorias necesarias para obtener estos roles. Tienes toda la información en <code>/ww logros</code>.",
      ] },
      { heading: "🐛 CORRECCIÓN DE ERRORES", items: [
        "<strong>🛡️ Caballero:</strong> Corregida su descripción. Solucionado el bug donde, si el lobo decisor moría en la votación, otro lobo aleatorio moría en la noche. Ahora el poder se anula si el decisor muere votado.",
        "<strong>🐺 Lobo Blanco:</strong> Solucionado el bug que le impedía ganar si llegaba a un 1v1 contra otro lobo.",
        "<strong>🪤 Cazador de Bestias:</strong> Se corrigió el uso infinito de trampas. Ahora, si mata a un lobo, la noche siguiente no tendrá trampa disponible.",
        "<strong>👥 Presets de Roles:</strong> La Ramera y el Infiel ya no pueden aparecer juntos en la misma partida.",
      ] },
    ],
  },
  {
    date: "07/04/2026",
    title: "Slash Commands y Saquea Tumbas",
    sections: [
      { heading: "🛠️ BUGS", items: [
        "<strong>Saquea Tumbas:</strong> El select de escrutinio ahora muestra el rol del usuario (Ej: insxyvictor (Vidente)).",
        "<strong>Saquea Tumbas:</strong> En el resumen final aparecen ambos roles (Ej: insxyvictor [Saquea Tumbas (Vidente)]).",
        "<strong>Alma Pura:</strong> Mensajes de muerte corregidos (Ej: \"Murió de pena al perder a su amor\").",
      ] },
      { heading: "📋 CAMBIOS", items: [
        "<strong>Slash Commands:</strong> Habilitados <code>/ww info</code>, <code>role</code>, <code>roles</code>, <code>help</code>, <code>stats</code>, <code>logros</code>, <code>wr</code> y <code>myrole</code> con respuestas privadas.",
      ] },
    ],
  },
  {
    date: "04/04/2026",
    title: "Roles Evolutivos y Blacklist",
    sections: [
      { heading: "🛠️ BUGS", items: [
        "<strong>Hechicera:</strong> Ya no despierta si no hay vidente vivo.",
        "<strong>Lobos:</strong> Ahora conocen quién es la hechicera.",
        "<strong>Lobos:</strong> Solucionado chat vía MD.",
        "<strong>Saquea Tumbas:</strong> Solucionado bug donde no despertaba.",
      ] },
      { heading: "📋 CAMBIOS", items: [
        "<strong>SISTEMA DE ROLES:</strong> Nuevo sistema de logros evolutivos (<code>,ww logros</code>).",
        "<strong>Blacklist Admins:</strong> Nuevos comandos <code>,ww bl</code> para gestión por administradores.",
      ] },
    ],
  },
  {
    date: "03/04/2026",
    title: "Saquea Tumbas y Nuevo Zorro",
    sections: [
      { heading: "🌟 NUEVO", items: [
        "<strong>Rol: Saquea Tumbas ⚰️:</strong> Nuevo rol añadido.",
        "<strong>Modificación Zorro:</strong> Su habilidad ahora tiene un solo uso por partida.",
        "<strong>Comando Stats:</strong> Ahora muestra estadísticas individuales de todos los roles.",
        "<strong>Comando WR:</strong> Estadísticas globales de los 4 bandos, incluidos solitarios.",
      ] },
      { heading: "🛠️ BUGS", items: [
        "<strong>Ramera:</strong> Solucionado error donde podía ir a la misma casa varias noches.",
        "<strong>Lobo Blanco:</strong> Solucionado error en el embed de presentación de MD aparecía en el bando lobo.",
        "<strong>Cazador:</strong> Solucionado bug donde la partida acababa sin dejarle disparar si era el último.",
        "<strong>Anciano:</strong> Al morir pierden poderes pero mantienen el rol (no se transforman todos en aldeanos).",
        "<strong>Presets:</strong> Solucionado bug donde aparecía lycan sin vidente.",
      ] },
      { heading: "📋 OTROS", items: [
        "<strong>Presets:</strong> Zorro no aparece en -10j. El curtidor aparece con más frecuencia.",
        "<strong>Mensaje Amanecer:</strong> Ahora muestra el número de jugadores vivos.",
      ] },
    ],
  },
  {
    date: "30/03/2026",
    title: "Votaciones y Balanceo de Roles",
    sections: [
      { heading: "🛠️ BUGS", items: [
        "<strong>Zorro:</strong> Ahora mantiene su rol de \"Zorro\" tras fallar el olfateo.",
        "<strong>Niño Salvaje:</strong> Corregida transformación cuando su ídolo muere.",
        "<strong>Victoria:</strong> Empate (\"Nadie ha sobrevivido\") si no queda nadie vivo.",
        "<strong>Lobo Blanco:</strong> Ahora aparece como solitario en todos los comandos de información.",
        "<strong>Cazador:</strong> Revisión de fin de partida tras el disparo para evitar partidas sin lobos.",
        "<strong>Hechicera:</strong> No aparece si no existe vidente en el preset.",
      ] },
      { heading: "📋 CAMBIOS", items: [
        "<strong>Alma Pura:</strong> Anuncio público movido al principio de la primera noche.",
        "<strong>Lobo Decisor:</strong> Cambia cada noche si quedan más lobos.",
        "<strong>Infiel:</strong> Muere al visitar cualquier miembro de los lobos (hechicera y blanco incluidos).",
        "<strong>Comando Normas:</strong> <code>,ww info</code> para ver las reglas.",
        "<strong>Sugerencias:</strong> Nuevos alias <code>suggestion/suggest/sugerencia</code>.",
        "<strong>Votaciones:</strong> Dividido en discusión (90s) y votación (30s).",
        "<strong>Votaciones Privadas:</strong> Ver <code>,ww help start</code> para configuración.",
      ] },
    ],
  },
  {
    date: "26/03/2026",
    title: "Gran Corrección de Errores",
    sections: [
      { heading: "🛠️ BUGS", items: [
        "<strong>Victoria Lobo:</strong> Solucionado error interno al calcular victoria por falta de conteo.",
        "<strong>Bug Casa Vacía:</strong> Mejorada lógica de supervivencia para Ramera e Infiel cuando ellos o sus objetivos no están.",
        "<strong>Hechicera:</strong> Suma victorias correctamente en su perfil personal.",
        "<strong>Fin de Partida:</strong> Mostrando mensajes de últimas muertes si la partida acaba de noche.",
        "<strong>Cazador:</strong> Si muere por Bruja o Amor, no puede disparar.",
        "<strong>Venganza Caballero:</strong> Ahora afecta correctamente al lobo decisor.",
        "<strong>Trampa Bestias:</strong> Ya no afecta a todas las muertes de la noche.",
        "<strong>Panadero:</strong> Contando correctamente el doble voto del jugador elegido.",
        "<strong>Bruja:</strong> Puede salvar a la víctima del Gran Lobo Feroz.",
        "<strong>Niño Salvaje:</strong> Ahora los lobos son avisados cuando se transforma.",
        "<strong>Zorro:</strong> Olfato corregido sobre el Licántropo (lo detecta como lobo).",
        "<strong>Amantes:</strong> Muerte por amor corregida para que siempre mueran ambos.",
      ] },
      { heading: "📋 CAMBIOS", items: [
        "<strong>Alias FS:</strong> Sustituye a <code>forcestart</code>.",
        "<strong>Presets:</strong> Mejorada la jugabilidad y el balance general.",
        "<strong>Prioridad Amantes:</strong> Victoria de amantes priorizada sobre Lobos en duelo final de 2 jugadores.",
        "<strong>Niño Salvaje:</strong> Recibe aviso de unión a la manada y aviso secreto a los lobos.",
      ] },
    ],
  },
];
