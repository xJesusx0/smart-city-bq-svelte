<script lang="ts">
  import * as Card from '$lib/components/ui/card';
  
  const services = [
    { title: 'Frontend', desc: 'Cliente web en Svelte para gestión y monitoreo', color: 'text-chart-1' },
    { title: 'Traffic API', desc: 'API Gateway con autenticación JWT', color: 'text-chart-2' },
    { title: 'Video Analysis', desc: 'Procesamiento con modelos de IA', color: 'text-chart-3' },
    { title: 'Traffic Decision', desc: 'Algoritmos de optimización', color: 'text-chart-4' },
    { title: 'Traffic Lights', desc: 'Control de semáforos físicos', color: 'text-chart-5' },
    { title: 'Main Database', desc: 'BD centralizada de usuarios y métricas', color: 'text-primary' }
  ];
</script>

<Card.Root class="mb-6">
  <Card.Header>
    <Card.Title class="text-2xl">Arquitectura del Sistema</Card.Title>
    <Card.Description>Basada en microservicios con responsabilidades bien definidas</Card.Description>
  </Card.Header>
  <Card.Content>
    <div class="grid md:grid-cols-3 gap-4">
      {#each services as service}
        <div class="p-4 rounded-lg border bg-card">
          <div class="flex items-center gap-2 mb-2">
            <svg class="h-4 w-4 {service.color}" fill="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" />
            </svg>
            <h4 class="font-semibold">{service.title}</h4>
          </div>
          <p class="text-sm text-muted-foreground">{service.desc}</p>
        </div>
      {/each}
    </div>
  </Card.Content>
</Card.Root>