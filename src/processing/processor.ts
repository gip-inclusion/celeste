import prisma from '../database';

export async function processEvents() {
  console.log(`🔄 Début du traitement des événements... - ${new Date().toISOString()}`);

  // Vérifier s'il existe une exécution en cours. Le cas échéant, on arrête sans rien faire.
  const pendingExecution = await prisma.execution.findFirst({
    where: { status: 'pending' },
  });
  if (pendingExecution) {
    console.warn(
      `⚠️ Une exécution est déjà en cours. Arrêt du traitement. - ${new Date().toISOString()}`,
    );
    return;
  }

  // Récupérer la dernière exécution (réussie ou échouée)
  const lastExecution = await prisma.execution.findFirst({
    where: { OR: [{ status: 'succeeded' }, { status: 'failed' }] },
    orderBy: { endedAt: 'desc' },
  });

  // On prend la date du dernier événement traité, sinon on commence au début des temps
  const fromDate = lastExecution?.lastProcessedEventCreatedAt ?? new Date(0);

  console.log(`🕒 Traitement des événements créés après ${fromDate.toISOString()}...`);

  // Créer une nouvelle entrée d'exécution
  const execution = await prisma.execution.create({
    data: {
      startedAt: new Date(),
      status: 'pending',
    },
  });

  try {
    // Récupérer les événements non traités (triés par `createdAt`)
    const events = await prisma.event.findMany({
      where: {
        createdAt: {
          gt: fromDate,
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    console.log(`📌 ${events.length} événements à traiter.`);

    let lastProcessedEventCreatedAt = null;
    const executionEventsData = [];

    for (const event of events) {
      console.log(`⚙️ Traitement de l'événement ${event.id}...`);

      // TODO: Implémenter les traitements métier ici

      executionEventsData.push({
        executionId: execution.id,
        eventId: event.id,
      });

      lastProcessedEventCreatedAt = event.createdAt;
    }

    // Insérer les événements traités dans la table pivot ExecutionEvent
    if (executionEventsData.length > 0) {
      await prisma.executionEvent.createMany({
        data: executionEventsData,
      });
    }

    // Mettre à jour l'exécution avec le statut "succeeded"
    await prisma.execution.update({
      where: { id: execution.id },
      data: {
        endedAt: new Date(),
        lastProcessedEventCreatedAt: lastProcessedEventCreatedAt,
        status: 'succeeded',
      },
    });

    console.log(`✅ Traitement terminé avec succès ! - ${new Date().toISOString()}`);
  } catch (error) {
    console.error('❌ Erreur lors du traitement :', error);

    // Marquer l'exécution comme échouée
    await prisma.execution.update({
      where: { id: execution.id },
      data: {
        endedAt: new Date(),
        status: 'failed',
      },
    });
  } finally {
    await prisma.$disconnect();
  }
}
