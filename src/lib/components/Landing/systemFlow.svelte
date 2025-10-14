<script lang="ts">
  import * as Card from '$lib/components/ui/card';
  
  const steps = [
    'Cámaras envían video al servicio de análisis de video',
    'El servicio extrae información relevante usando modelos de IA (autos, peatones, etc.)',
    'Los datos se envían al servicio de decisiones que calcula la mejor estrategia',
    'El servicio de semáforos aplica las decisiones sobre los dispositivos físicos',
    'El Traffic API centraliza la comunicación con el cliente web y la base de datos',
    'Usuarios administradores gestionan roles y monitorean el estado del sistema'
  ];
</script>

<Card.Root class="mb-8">
  <Card.Header>
    <Card.Title class="text-2xl">Flujo del Sistema</Card.Title>
  </Card.Header>
  <Card.Content>
    <ol class="space-y-3">
      {#each steps as step, i}
        <li class="flex gap-3">
          <span class="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-semibold">
            {i + 1}
          </span>
          <span>{step}</span>
        </li>
      {/each}
    </ol>
  </Card.Content>
</Card.Root>