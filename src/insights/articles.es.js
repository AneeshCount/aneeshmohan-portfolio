/* Insights: Spanish. Mirrors articles.en.js block for block. */

export default {
  'why-ai-fails': {
    blocks: [
      { t: 'p', v: 'Casi todas las empresas con las que hablamos ya han probado la IA. Un piloto, un chatbot, una suscripción para todo el equipo. Un número sorprendente no tiene nada que enseñar: ni horas ahorradas que puedan señalar, ni una partida de coste que se haya movido, ni un cliente que lo haya notado. Después se instala la conclusión de que la IA está sobrevalorada.' },
      { t: 'p', v: 'No es el modelo. Los sistemas disponibles hoy son muy superiores al trabajo que la mayoría de las empresas les pide. Los fallos son casi siempre los mismos seis, y todos tienen arreglo.' },

      { t: 'h', v: '1. Compraste un chatbot cuando necesitabas trabajo terminado' },
      { t: 'p', v: 'Un chatbot responde. Un agente termina. La diferencia importa porque a una empresa no le faltan respuestas, le sobra trabajo sin cerrar: llamadas sin devolver, presupuestos sin enviar, facturas sin reclamar, tickets sin clasificar. Si tu IA produce texto sobre el que después tiene que actuar una persona, has añadido un paso, no lo has quitado.' },
      { t: 'p', v: 'La solución es definir el entregable antes que la herramienta. No "un asistente de IA para el equipo comercial", sino "cada lead entrante recibe una respuesta cualificada y una cita agendada en menos de cuatro minutos, a cualquier hora". Esa frase se puede comprobar. "Asistente de IA" no.' },

      { t: 'h', v: '2. No puede tocar los sistemas donde ocurre el trabajo de verdad' },
      { t: 'p', v: 'Una IA que no puede escribir en tu CRM, tu calendario, tu base de datos o tu centralita es un generador de sugerencias. Casi todo el valor de la automatización está en el lado de la escritura, y ese es justo el lado que la mayoría de los pilotos se salta, porque exige integración real, permisos reales y un plan de reversión.' },
      { t: 'p', v: 'Esta es la mayor línea divisoria que vemos entre los proyectos que mueren en silencio y los que se renuevan. Una IA de solo lectura es una demo. Una IA con acceso de escritura acotado, traza de auditoría y un paso de aprobación humana donde el riesgo lo justifica es una compañera de trabajo.' },

      { t: 'h', v: '3. Nadie acordó qué significa "funcionar"' },
      { t: 'p', v: 'Pregunta a un equipo cómo fue su piloto de IA y obtendrás impresiones. Parecía útil. Una vez se equivocó. A alguien de operaciones no le gustó.' },
      { t: 'p', v: 'No se puede gestionar lo que nunca se midió. Antes de que nada salga a producción, captura la línea base: cuántos minutos por ticket hoy, qué porcentaje de llamadas se atiende realmente, cuánto tarda un lead en recibir la primera respuesta y cuánto cuesta cada cosa a coste completo. Luego fija el listón que el agente tiene que superar, y monta un pequeño conjunto de evaluación con casos reales y resultados conocidos para poder distinguir una regresión de la mala suerte.' },
      { t: 'quote', v: 'Una sola alucinación mata un proyecto que no tenía números. En un proyecto que sí los tiene, es solo un informe de error.' },

      { t: 'h', v: '4. El piloto estaba diseñado para no terminar nunca' },
      { t: 'p', v: 'Los pilotos que corren sobre datos sintéticos, en un entorno aislado, sin responsable y sin fecha de fin son una forma de parecer ocupado sin decidir nada. Seis meses después la herramienta ha cambiado, el impulsor interno ha cambiado de puesto y el trabajo vuelve a empezar de cero.' },
      { t: 'p', v: 'Dale en cambio una porción real. Un equipo, un flujo de trabajo, datos reales, clientes reales, de cuatro a seis semanas y una decisión al final: seguir o parar. Algo estrecho en producción enseña más en dos semanas que algo amplio en preproducción en dos trimestres.' },

      { t: 'h', v: '5. Automatizaste un proceso que ya estaba roto' },
      { t: 'p', v: 'La IA es un amplificador. Apúntala a un flujo con responsabilidades difusas, tres fuentes de verdad y un montón de excepciones no documentadas, y obtendrás respuestas equivocadas más rápido y a escala. El desorden lo estaba absorbiendo el criterio humano, y automatizar el flujo es exactamente lo que elimina ese criterio.' },
      { t: 'p', v: 'Cuando un proceso está realmente roto, arregla primero el proceso o elige otro. Casi siempre hay al lado un flujo más limpio, más caro y más repetitivo que habría sido el mejor primer objetivo de todos modos.' },

      { t: 'h', v: '6. A nadie le facilitó el trabajo, así que nadie lo usó' },
      { t: 'p', v: 'La adopción no es un problema de formación. La gente usa una herramienta cuando le quita trabajo que detesta, y la ignora sin decir nada cuando añade un paso de revisión a algo que ya hacía bien. Si tu agente necesita que alguien revise su resultado todas y cada una de las veces, has contratado a un becario y le has dado la supervisión a tu persona más cara.' },
      { t: 'p', v: 'Apunta la primera construcción al trabajo que tu equipo detesta activamente: llamadas fuera de horario, introducción de datos, clasificación de primer nivel, perseguir documentos. La adopción se resuelve sola cuando la alternativa es peor.' },

      { t: 'h', v: 'Cómo son los que sí funcionan' },
      { t: 'p', v: 'Los proyectos que se pagan solos son poco vistosos y comparten una misma forma:' },
      { t: 'ol', v: [
        'Un flujo de trabajo, elegido porque es caro, repetitivo y medible.',
        'Un número de referencia capturado antes de construir nada.',
        'Acceso de escritura a los sistemas reales, bien acotado y con traza de auditoría.',
        'Un camino de fallo definido: qué hace el agente cuando duda y a quién escala.',
        'En producción con usuarios reales en semanas, no una demo retenida durante trimestres.',
        'Un responsable único con autoridad para cancelarlo.',
      ] },
      { t: 'p', v: 'Nada de eso va realmente sobre IA. Es disciplina de entrega corriente, aplicada a una tecnología que mucha gente sigue tratando como una excepción a esa disciplina. Esa es la razón real por la que la mayoría de las empresas no obtiene nada.' },
    ],
  },

  'ai-advantage': {
    blocks: [
      { t: 'p', v: 'Hay un argumento cómodo para esperar. Las herramientas cambian cada mes, los precios siguen bajando y la integración ingeniosa de hoy es la casilla de una lista de características del año que viene. Que otro pague el aprendizaje y luego adoptamos la versión madura. Con la mayoría de las tecnologías ese argumento ha sido correcto.' },
      { t: 'p', v: 'Aquí es erróneo, y la razón es concreta: casi ninguna parte de la ventaja vive en el modelo.' },

      { t: 'h', v: 'El modelo es la parte que puedes comprar después. El resto no.' },
      { t: 'p', v: 'Un modelo de frontera es una materia prima, y además alquilada. Tu competencia puede suscribirse mañana al mismo modelo y al mismo precio que pagas tú. A lo que no puede suscribirse, el día que decida empezar, es a nada de esto:' },
      { t: 'ul', v: [
        'Flujos de trabajo ya rediseñados en torno a lo que un agente puede hacer de verdad.',
        'Datos limpios, estructurados y accesibles, porque dos años de trabajo con IA obligaron a ordenarlos.',
        'Conjuntos de evaluación y salvaguardas construidos a partir de fallos reales en producción.',
        'Un equipo que sabe por experiencia dónde funciona esto y dónde no.',
        'Clientes ya acostumbrados a tus tiempos de respuesta.',
      ] },
      { t: 'p', v: 'Cada uno de esos puntos costó tiempo de calendario, no presupuesto. Por eso la distancia se acumula en lugar de cerrarse.' },

      { t: 'h', v: 'La distancia aparece en los costes unitarios, no en las notas de prensa' },
      { t: 'p', v: 'Si quitamos el lenguaje grandilocuente, adoptar bien la IA hace una sola cosa: baja el coste marginal de una operación, normalmente mucho, y elimina la cola.' },
      { t: 'p', v: 'Un competidor cuya recepción atiende todas las llamadas a las dos de la madrugada, cuyos presupuestos salen en noventa segundos en vez de en dos días y cuyo soporte cuesta una fracción por ticket no gana por la tecnología. Gana porque ahora puede decir que sí a trabajos que tú tienes que rechazar, y cobrar menos por ellos.' },
      { t: 'p', v: 'No lo verás como un anuncio. Lo verás como una caída lenta e inexplicable de tu tasa de cierre.' },
      { t: 'quote', v: 'Nadie pierde contra la IA. Se pierde contra un competidor cuyo tiempo de respuesta pasó de dos días a dos minutos.' },

      { t: 'h', v: 'Esperar tiene un precio, y es medible' },
      { t: 'p', v: 'La forma honesta de mirarlo no es "deberíamos hacer IA". Es aritmética. Coge un flujo de trabajo. Cuenta lo que cuesta hoy: horas, salario, tasa de error, operaciones perdidas por respuestas lentas. Multiplica por el número de trimestres que piensas esperar. Esa es la factura de la decisión de esperar, y suele ser mayor que lo que habría costado construirlo.' },
      { t: 'p', v: 'Después suma la parte que nunca aparece en la factura: los cambios de proceso, las contrataciones y el trabajo de datos que harás más tarde con prisa, mientras un competidor los hizo con calma ahora.' },

      { t: 'h', v: 'Ir por delante no significa ir a lo loco' },
      { t: 'p', v: 'Ir por delante no significa reconstruir la empresa alrededor de un chatbot ni firmar un contrato de plataforma de siete cifras. En la práctica significa:' },
      { t: 'ol', v: [
        'Elegir un flujo de trabajo por trimestre y entregarlo de verdad.',
        'Mantener la capa del modelo intercambiable, porque se va a intercambiar.',
        'Ser dueño de tus datos, tus prompts y tus conjuntos de evaluación, los construya quien los construya.',
        'Construir conocimiento interno, no solo una relación con un proveedor.',
        'Estar dispuesto a cancelar rápido y sin dramas lo que no funciona.',
      ] },
      { t: 'p', v: 'Es un programa modesto y poco emocionante. Mantenido dos años produce algo que un competidor no puede alcanzar firmando un cheque, que es justamente el objetivo.' },

      { t: 'h', v: 'La ventana es más estrecha de lo que parece' },
      { t: 'p', v: 'La capacidad se está convirtiendo en materia prima muy rápido, y hay quien lo lee como una razón para relajarse. Es lo contrario. Cuando todos tienen los mismos modelos, el diferencial se desplaza por completo a la integración, al proceso propio y a los datos propios, y esas son precisamente las partes lentas de construir. La ventaja disponible para una empresa que empieza hoy no es tener un modelo mejor que el de su competencia. Son dos años de ventaja en todo aquello a lo que el modelo se conecta.' },
    ],
  },
};
