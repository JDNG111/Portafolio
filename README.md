# Taller Evaluable

Corte 2

Inteligencia Artificial

2025A:

***Hecho por: Julian David Navarro G.***

Mayo 10 del 2025

![image](https://github.com/user-attachments/assets/61f58af5-541c-45a2-baf6-567b09d38996)


Este código implementa un chatbot conversacional personalizado utilizando modelos de lenguaje de tipo *decoder-only* como Qwen, con soporte para mantener el historial del diálogo y ser desplegado en una interfaz web mediante Gradio. Comienza cargando el modelo y el tokenizador, prepara el dispositivo (dependiendo si estamos trabajando en CPU o GPU), y define funciones para procesar las entradas y generar respuestas. Utiliza una clase `GestorContexto` para recordar los turnos anteriores de la conversación y construir el prompt contextual. La clase `Chatbot` organiza el flujo completo desde la entrada del usuario hasta la respuesta del asistente, y permite configurar instrucciones de comportamiento inicial. También incluye la opción de aplicar ajustes finos al modelo con LoRA (una técnica ligera de fine-tuning) y guardar o cargar versiones personalizadas del modelo. Finalmente, la función `main_despliegue` configura el chatbot, genera la interfaz interactiva web y la lanza, permitiendo al usuario probar el asistente directamente en el navegador.

