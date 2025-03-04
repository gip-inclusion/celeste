import { faker } from '@faker-js/faker';
import prisma from '../../src/database';

const clients = [
  { name: 'Dora', source: 'dora' },
  { name: 'Immersion Facilitée', source: 'immersion-facilitee' },
  { name: 'RDV Insertion', source: 'rdv-insertion' },
  { name: 'Emplois', source: 'emplois' },
  { name: 'Marché', source: 'marche' },
  { name: 'Data Inclusion', source: 'data-inclusion' },
];

type ClientSource = (typeof clients)[number]['source'];

const eventTypes: Record<ClientSource, string[]> = {
  dora: ['dora.orientation.proposee', 'dora.accompagnement.termine'],
  'immersion-facilitee': ['if.candidature.soumise', 'if.immersion.validee'],
  'rdv-insertion': ['rdv.insertion.planifie', 'rdv.insertion.realise'],
  emplois: ['emplois.pass.delivree', 'emplois.structure.cree', 'emplois.structure.modifiee'],
  marche: ['marche.contrat.signe', 'marche.projet.lance'],
  'data-inclusion': ['data-inclusion.partage', 'data-inclusion.maj.effectuee'],
};

const NUM_ACTORS = 1000;
const NUM_BENEFICIARIES = 100;
const START_DATE = new Date('2022-01-01');
const END_DATE = new Date('2025-02-28');

const actors = Array.from({ length: NUM_ACTORS }, () => faker.internet.email());
actors.push('john@example.org');
actors.push('jane@example.org');
const beneficiaries = Array.from({ length: NUM_BENEFICIARIES }, () => faker.internet.email());
beneficiaries.push('john@example.org');
beneficiaries.push('jane@example.org');

const randomDate = (start: Date, end: Date) =>
  new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

async function seedDatabase(nb_events: number) {
  console.log('Insertion des clients...');

  for (const client of clients) {
    await prisma.client.upsert({
      where: { source: client.source, name: client.name },
      update: {},
      create: {
        id: faker.string.uuid(),
        name: client.name,
        source: client.source,
        apiToken: faker.string.uuid(),
        createdAt: new Date(),
      },
    });
  }

  const clientMap = await prisma.client.findMany({ select: { id: true, source: true } });
  const clientIdMap = new Map(clientMap.map((c) => [c.source, c.id]));

  console.log(`Début de la génération de ${nb_events} événements...`);

  const events = Array.from({ length: nb_events }, () => {
    const client = clients[Math.floor(Math.random() * clients.length)];
    return {
      type: eventTypes[client.source][Math.floor(Math.random() * eventTypes[client.source].length)],
      source: client.source,
      timestamp: randomDate(START_DATE, END_DATE),
      actorSub: actors[Math.floor(Math.random() * NUM_ACTORS)],
      actorType: 'user',
      beneficiarySub:
        Math.random() < 0.8 ? beneficiaries[Math.floor(Math.random() * NUM_BENEFICIARIES)] : null,
      structureSub: null,
      adminSub: null,
      payload: {},
      createdAt: new Date(),
      clientId: clientIdMap.get(client.source) || '',
    };
  });

  await prisma.event.createMany({ data: events });

  console.log(`Génération terminée : ${nb_events} événements insérés en base.`);
  await prisma.$disconnect();
}

const nb_events = process.argv[2] ? parseInt(process.argv[2], 10) : 10000;
seedDatabase(nb_events).catch((error) => {
  console.error("Erreur lors de l'insertion des données :", error);
  prisma.$disconnect();
  process.exit(1);
});
