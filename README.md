# Generación de Test A/B y Creador del SharedCode

Este proyecto nace para hacenros la vida mas sencilla de cara a crear nuevos Test A/B con la herramienta Optimizely. El alcance de las funcionalidades con las que cuenta este proyecto es:
- Creación del Test en Optimizely mediante los datos de un JSON
- Creación del código 'SharedCode' para después copiarlo y subirlo a Optimizely

Por tanto, como sabes, con este proyecto no vas a poder crear el código de la variante. Eso lo tienes que hacer directamente en Optimizely, pero no te preocupes que estamos en ello 😏

## Instalación

> [!IMPORTANT]
> Para poder utilizar las maravillosas funcionalidades que ofrece este proyecto es imprescindible instalar [Bun](https://bun.sh/)🧅, sólo está disponible para su instalación en Mac, Linux y en Windows con Subsistema de Linux (WSL) instalado. Para poder instalar Bun en vuestro ordenador, podéis ejecutar el siguiente comando:

```
curl -fsSL https://bun.sh/install | bash
```
Una vez que ya tengáis instalado Bun en vuestro ordenador, ya podéis instalar las dependencias del proyecto con el siguiente comando:
```
bun install
```
Cuando se haya instalado (no tarda practicamente nada en hacerlo, porque Bun es... 💜), ya estás en disposición de utilizar este maravilloso proyecto.

## Estructura del proyecto 🗂️
Este proyecto está estructurado con las siguientes carpetas:

<table border="0">
 <tr>
   <td><img src='https://github.com/NachoMMO/PB-Gen-TestAB/assets/103255390/0422a173-84d0-481c-9394-53c2038e0a80' /> </td>
   <td>
     <ul>
       <li>
         <b>src</b> 📦:
         <ul>
           <li><b>api</b> 🗺️: Contiene diferentes ficheros correspondientes con la comunicación con Optimizely</li>
           <li><b>sharedCode</b> 🎡: Es donde vamos a crear nuestro código compartido para el Test</li>
           <li><b>data.json</b>: Rellenar con los datos necesarios para la creación del Test</li>
           <li><b>database.ts</b> 💾: Almacena las diferentes opciones que podemos utilizar para la creación de nuestro test en cuanto a tipos de audiencia y las diferentes métricas</li>
           <li><b>index.ts</b>: Es el fichero principal que contiene la funcionalidad necesaria para la creación de nuestro test</li>
           <li><b>utils.ts</b>: Contiene funciones de utilidades para reutilizarlas en el proyecto</li>
         </ul>
       </li>
       <li><b>test</b> 🧪: Archivos de test del proyecto</li>
       <li><b>babelrc</b> 🛠️: Configuración de Babel para la traspilación del SharedCode</li>
       <li><b>package.json</b> 🧰: Configuración del proyecto, con todos los scripts disponibles (mas adelante los comentamos)</li>
     </ul>
   </td>
 </tr>
</table>

### data.json 🎛️: Cómo rellenar los datos de nuestro test
```json
{
  "audience": "",
  "code": "",
  "countries": [],
  "description": "",
  "name": "",
  "metrics_keys": []
}
```
Siguiendo la estructura del JSON que tenemos que rellenar, vamos a comentar qué son los campos descritos:
<ul>
  <li><b>aundience</b>: Indicamos a que audiencia queremos que vaya destinada nuestro Test. Las opciones disponibles las encontramos en <b>database.ts</b></li>
  <li><b>code</b>: Este es el código del Test, el cual, obtenemos del ticket de negocio (por ejemplo: https://axinic.central.inditex.grp/jira/browse/ITSMECOM-2313862)</li>
  <li><b>countries</b>: Rellenar con los códigos de países en string y separados por , (por ejemplo: 'es', 'mx', 'tr')</li>
  <li><b>description</b>: Introducimos la descripción del Test que tenemos en el ticket de negocio</li>
  <li><b>name</b>: Es el nombre que tenemos en el ticket de negocio</li>
  <li><b>metrics_keys</b>: Hay que rellenarlo con las keys de las diferentes métricas que queremos medir en el Test, en string y separadas por , (las opciones disponibles de las métricas, están disponibles en <b>database.ts</b>)</li>
</ul>

> [!WARNING]  
> Puede ser que cuando hagamos un Test, cuando vayamos a rellenar las **metrics_keys** nos encontremos en la situación de que no tenemos la métrica definida en **database.ts**. En ese caso, podemos añadirla como una mas para que la tengamos disponible. Hay unas cuantas creadas ya que utilizarás seguramente.
 
> [!IMPORTANT] 
> Es SUPER IMPORTANTE el orden en el que pongamos las diferentes métricas en el array, ya que ese será el orden que se reflejará en Optimizely, que acuérdate, tienen que estar en el orden reflejado en el ticket de negocio.

## Funcionalidades
### Generar un Test A/B nuevo 🪡
Para poder generar un nuevo Test, primero deberemos rellenar el **data.json** con los datos correspondientes. Una vez que lo hagamos, basta con que en la raíz del proyecto, ejecutemos el siguiente comando:
```
bun gen-test-ab
```
En la consola podemos ir viendo que se van creando los eventos en Optimizely, los cuales se corresponden con las métricas que hemos definido en el fichero de configuración **data.json**. Cuando finalice el proceso, se mostrará por consola el resultado del Test A/B creado que nos devuelve Optimizely a la hora de crearlo con la API.

> [!CAUTION]
> El proceso que sigue para realizar la creación del Test se encuentra definido dentro del fichero **src/index.ts**, el cual no se debe de modificar para no afectar a la correcta creación del Test.

> [!CAUTION]
> En la versión actual del desarrollo, cuando se crea el Test A/B, lo hace sin activar la integración con Google Analytics, la cual es necesaria para el correcto funcionamiento del mismo. Hasta la próxima versión, tenemos que realizar la activación de la integración a mano, una vez que lo hayamos creado, en la plataforma de Optimizely. Para ello:
> - Nos vamos a nuestro experimento que hemos creado
> - Vamos a la sección de "Integrations"
> - Marcamos como seleccionado "Google Analytics 4" y el check que se nos habilita justo debajo de ese.

Tendría que quedarnos de la siguiente forma:

![image](https://github.com/NachoMMO/PB-Gen-TestAB/assets/103255390/9d2822da-3dbf-4478-aa0d-2c0ff7a2d86f)

### Creación del SharedCode 💪
Adicionalmente de crear el Test en la plataforma de Optimizely, otra parte fundamental que hay que realizar es la de crear el código correspondiente que se encargará de informar a Optimizely cuando tiene que trackear las métricas que hemos decidido medir para ese Test en concreto.

Hasta ahora, ese código se ha creado en el propio editor de Optimizely, el cual es bastante pobre y deja mucho que desear. Es por eso, que este proyecto también permite la creación de dicho código, para que después de crearlo, compilarlo y traspilarlo a ES5, sólo tengas que copiarlo y pegarlo en la sección correspondiente de Optimizely.

#### Pero... Y dónde tengo que crear ese código? 🧐
No te preocupes! Para eso tienes el fichero **./src/sharedCode/index.ts**, en el que tienes que modificar el contenido de la función **main** con el código que quieras! Hay partes de este código que son comunes, las cuales tendrás por defecto cuando crees una nueva rama a partir de la rama **develop** para empezar a codificar tu test.

#### Ahhhh, vale! Pero comentame un poquito como funciona! 😟
Cuando empieces a editar tu SharedCode, te encontrarás con el siguiente código en el fichero **./src/sharedCode/index.ts**:
```ts
import Optimizely from "./global/Optimizely.js";
import { parseMetrics } from "./global/utils.js";
import { code as experimentCode, metrics_keys } from '../data.json' assert { type: 'json' };

const inditex = window['inditex'] || {};
const Backbone = window['Backbone'] || {};

const main = () => {
  const parsedMetrics = parseMetrics(metrics_keys);

  const isCategoryInExperiment = () => {
    return true;
  }

  const optimizely = new Optimizely(parsedMetrics, experimentCode, isCategoryInExperiment);

  if (inditex.iPage === 'ItxOrderConfirmationPage') {
    optimizely.trackConfirmationRevenue();
  }
};

if (Backbone) {
  main();
}
```
Donde tienes que empezar a modificar el fichero, añadiendo el código en concreto que te interese es después del **if (inditex.iPage === 'ItxOrderConfirmationPage')** de la línea 17, bindeando los eventos que te permitan medir lo que te interese, por ejemplo, cuando se añade un producto a cesta, cuando se hace click en un producto de una parrilla, etc...

Nota que hay una función **isCategoryInExperiment**, la cual, se utiliza para filtrar posibles casos de uso para que solo se contabilice aquellos que cumplan la condición que le pongas a la función. Esto para qué sirve? Pues que a lo mejor tu quieres detectar que se hace click en el selector de tallas de la ficha de producto, pero sólo cuando dicho producto tenga un único color disponible. Pues con esta función, añadiendo esa condición podrías controlarlo =)

#### Y hay algun sitio donde tengamos métodos comunes que se repiten Test tras Test?
Cooooooorrecto ✅
En el fichero **./src/sharedCode/global/Optimizely.ts** tenemos una clase que almacena todos los métodos que poco a poco, dependiendo de cómo queremos medir las métricas, vamos creando de cara a que se puedan reutilizar en próximos test. Por ejemplo, dentro de dicha clase, tenemos un método **registerMetrics** que nos sirve para trackear las métricas de visitas en cada Test.

> [!TIP]
> Si alguna vez, cuando desarrollas un Test, añades un nuevo método dentro de **Optimizely.ts**, deberías subir ese cambio a la rama **develop** de cara a que se cuente con esa funcionalidad en los Test futuros.

#### Perfecto! Ya tengo mi SharedCode, como lo puedo generar?
Súper fácil, una vez que ya lo tienes listo en tu fichero **./src/sharedCode/index.ts**, tan solo tienes que ejecutar el siguiente comando:
```
bun build-def
```

Si no ha habido ningún fallo al compilar y traspilar el código a ES5, deberías ver que se ha creado una carpeta **build** y dentro de ella, hay un fichero **index.js**. El contenido de este fichero es el que tienes que pegar en la sección **sharedCode** de Optimizely.

## Se vienen cositas... 🥰
- [ ] Automatizar la integración con Google Analytics desde el script de creación
- [ ] Subir el código de sharedCode desde el proyecto, sin tener que copiarlo y pegarlo
- [ ] Crear el código de la variante y subirlo desde el script

## Preguntitas frecuentes ⁉️
### Y cómo trabajamos dentro de este proyecto?
> [!TIP]
> Para poder almacenar todos los cambios que se van realizando con cada uno de los test que se van creando, vamos a definir la siguiente forma de trabajar con este proyecto:
> - Creamos una rama desde la rama **develop** con el formato: test/<códigoDelTest>, por ejemplo: **test/2314326**
> - Rellenamos los datos del fichero **./src/data.json** con lo correspondiente del Test
> - Creamos el Test con el comando **bun gen_test_ab**
> - Desarrollamos el **sharedCode** y lo subimos a Optimizely de manera manual (hasta próximas versiones)
> - Cuando hayamos terminado el desarrollo, subimos los cambios a nuestra rama y la dejamos sin mergear en develop
>   - En el caso de que hayamos creado una nueva métrica, deberemos subir esa métrica a la rama de **develop** para que esté disponible en futuros test

## License

[MIT](https://choosealicense.com/licenses/mit/)
