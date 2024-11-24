<script setup lang="ts">
import { CheckCircleIcon } from '@heroicons/vue/24/outline'

import { useRouteTitle } from '@/composables/useRouteTitle'

const { setTitle } = useRouteTitle()
setTitle('Mitwirkende')

const people = [
  {
    name: 'Daniel Swiatek',
    role: 'Initiator',
    imageUrl: 'https://avatars.githubusercontent.com/u/9080990?v=4',
  },
  {
    name: 'Torge Jürgensen',
    role: 'Contributor',
    imageUrl: 'https://avatars.githubusercontent.com/u/7646204?v=4',
  },
  {
    name: 'Axel Rindle',
    role: 'Contributor',
    imageUrl: 'https://avatars.githubusercontent.com/u/7105632?v=4',
  },
  {
    name: 'Momme Jürgensen',
    role: 'Contributor',
    imageUrl: 'https://avatars.githubusercontent.com/u/15056397?v=4',
  },
  {
    name: 'Lasse Eggers',
    role: 'Contributor',
    imageUrl: 'https://avatars.githubusercontent.com/u/29912749?v=4',
  },
  {
    name: 'Lukas Hauenstein',
    role: 'Contributor',
    imageUrl: 'https://avatars.githubusercontent.com/u/20169396?v=4',
  },
  {
    name: 'Barne Jürgensen',
    role: 'Contributor',
    imageUrl: 'https://avatars.githubusercontent.com/u/1502820?v=4',
  },
  {
    name: 'Jeremy Boy',
    role: 'Contributor & Sponsor',
    imageUrl: 'https://avatars.githubusercontent.com/u/6078522?v=4',
  },
  {
    name: 'Fabian Rogge',
    role: 'Contributor',
    imageUrl: 'https://avatars.githubusercontent.com/u/16214836?v=4',
  },
  {
    name: 'CODEANKER',
    role: 'Sponsor',
    imageUrl: 'https://avatars.githubusercontent.com/u/13403000?v=4',
  },
  {
    name: 'ACT',
    role: 'Sponsor',
    imageUrl: 'https://avatars.githubusercontent.com/u/150189827?v=4',
  },
]
</script>

<template>
  <div class="py-10 px-8 md:px-8 lg:px-0">
    <div class="mx-auto max-w-3xl text-base leading-7">
      <h1 class="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Ein Open-Source-Projekt</h1>
      <p class="mt-6 text-xl leading-8">
        Diese Software wird als Open-Source-Projekt entwickelt. Jede Person kann sich einbringen und an diesem Projekt
        mitarbeiten. Der Code ist öffentlich zugänglich und kann frei verwendet werden.
      </p>
      <div class="mt-10 max-w-2xl">
        <p>
          Es gab schon immer die Idee eine Software für die Anmeldung zum Landeskindertreffen zu entwickeln. Mehrere
          Versuche scheiterten aus verschiedenen Gründen. Im Jahr 2023 gab es einen neuen Anlauf. Viele der
          Contributoren sind beruflich in der Softwareentwicklung tätig und haben sich bereit erklärt, dieses Projekt zu
          unterstützen. Mit einem gemeinsamen Kickoff im Gästehaus der DLRG in Eckernförde haben wir gestartet und
          entwickeln seit dem gemeinsam an diesem Projekt. Dort haben wir uns auch entschieden das Projekt als Open
          Source zu entwickeln.
        </p>
        <figure class="mt-10 border-l border-primary-600 pl-9">
          <blockquote class="font-semibold">
            <p>
              “Für das Landeskindertreffen wollte ich eine Software zur Anmeldung entwickeln und habe engagierte
              Menschen aus meinem beruflichen und privaten Umfeld gefunden.”
            </p>
          </blockquote>
          <figcaption class="mt-6 flex gap-x-4">
            <img
              class="h-6 w-6 flex-none rounded-full bg-gray-50"
              src="https://avatars.githubusercontent.com/u/9080990?v=4"
              alt=""
            />
            <div class="text-sm leading-6"><strong class="font-semibold">Daniel Swiatek</strong> – Initiator</div>
          </figcaption>
        </figure>

        <p class="mt-8">
          "Wir laden dich herzlich dazu ein, an unserem Open Source Software Projekt für die Veranstaltungsanmeldung
          mitzumachen! Gemeinsam schaffen wir eine offene und kollaborative Umgebung, in der jede Stimme zählt. Deine
          Fähigkeiten und Ideen sind von unschätzbarem Wert, um diese Plattform zu verbessern und zu erweitern.
        </p>
        <p>
          Indem du an diesem Projekt teilnimmst, trägst du nicht nur zur Entwicklung einer benutzerfreundlichen und
          effizienten Lösung für die Veranstaltungsorganisation bei, sondern erfährst auch den unmittelbaren Einfluss
          deiner Beiträge. Es ist eine Gelegenheit, mit Gleichgesinnten zusammenzuarbeiten, Wissen zu teilen und
          gemeinsam innovative Lösungen zu schaffen.
        </p>
        <p>
          Egal, ob du Entwickler:in, Designer:in, Tester:in oder einfach nur begeistert von Open Source bist – jede:r
          ist willkommen! Deine Beteiligung macht einen Unterschied. Deine Expertise ist gefragt, und wir freuen uns
          darauf, mit dir gemeinsam an diesem spannenden Projekt zu arbeiten!"
        </p>
        <h2 class="mt-16 text-2xl font-bold tracking-tight">Was ist Open Source?</h2>
        <p class="mt-6">
          Open Source Software (OSS) bezeichnet Software, deren Quellcode öffentlich zugänglich ist und die unter einer
          Lizenz veröffentlicht wird, die es erlaubt, den Code, zu verwenden, zu ändern und zu verteilen. Im Gegensatz
          zu proprietärer Software, bei der der Quellcode in der Regel nicht öffentlich einsehbar ist und nur die
          ausführbare Version der Software bereitgestellt wird, ermöglicht Open Source Software eine transparente
          Zusammenarbeit und partizipative Entwicklung. Das zeichnet Open Source aus:
        </p>
        <ul
          role="list"
          class="mt-8 max-w-xl space-y-8"
        >
          <li class="flex gap-x-3">
            <CheckCircleIcon
              class="mt-1 h-5 w-5 flex-none text-primary-600"
              aria-hidden="true"
            />
            <span
              ><strong class="font-semibold">Freie Zugänglichkeit zum Quellcode:</strong> Das zentrale Merkmal von Open
              Source Software ist die offene Verfügbarkeit des Quellcodes. Jede:r kann den Quellcode einsehen,
              modifizieren und anpassen. Dies fördert Transparenz, ermöglicht Fehlerbehebungen und erlaubt es
              Entwickler:innen weltweit, zur Verbesserung der Software beizutragen.</span
            >
          </li>
          <li class="flex gap-x-3">
            <CheckCircleIcon
              class="mt-1 h-5 w-5 flex-none text-primary-600"
              aria-hidden="true"
            />
            <span
              ><strong class="font-semibold">Freie Verbreitung:</strong> Open Source Software kann frei kopiert,
              weitergegeben und verteilt werden. Benutzer:innen haben die Freiheit, die Software zu nutzen, zu teilen
              und sogar kommerziell zu vertreiben. Diese Freiheit zur Verbreitung fördert eine breite Verfügbarkeit und
              unterstützt die Verbreitung der Software in verschiedenen Umgebungen.</span
            >
          </li>
        </ul>
        <p class="mt-10">
          Durch diese Prinzipien fördert Open Source Software eine offene und kollaborative Entwicklungsweise, bei der
          die Stärken einer globalen Entwicklergemeinschaft genutzt werden, um qualitativ hochwertige Software zu
          schaffen.
        </p>
      </div>
      <div
        class="mx-auto flex flex-col gap-16 bg-white/5 px-6 py-16 ring-1 ring-white/10 lg:flex-row lg:items-center xl:gap-x-20 xl:px-20 border-t border-b border-gray-200 dark:border-gray-800 mt-16"
      >
        <img
          class="h-32 w-32 flex-none rounded-full aspect-square"
          src="@/assets/images/svg/github-mark.svg"
          alt=""
        />
        <div class="w-full flex-auto">
          <h2 class="text-3xl font-bold tracking-tight sm:text-4xl">Werde teil des Teams</h2>
          <p class="mt-6 text-lg leading-8">
            Starte jetzt die Mitarbeit am Projekt. Wir organisieren uns mit Issues und Pull-Requests und helfen dir beim
            On-Boarding.
          </p>

          <div class="mt-10 flex">
            <a
              href="https://github.com/codeanker/brahmsee.digital"
              target="_blank"
              rel="noopener noreferrer"
              class="text-sm font-semibold leading-6 text-primary-600"
              >zum Github-Projekt <span aria-hidden="true">&rarr;</span></a
            >
          </div>
        </div>
      </div>

      <div class="mt-16 max-w-2xl">
        <h2 class="text-2xl font-bold tracking-tight">Vielen Dank an alle Contributor:innen und Sponsoren</h2>
        <p class="mt-6">
          Ein großes Dankeschön geht an alle Contributor:innen und Sponsoren die an diesem Projekt mitgearbeitet haben
          und es noch immer tun.
        </p>
      </div>

      <ul
        role="list"
        class="mx-auto mt-10 grid max-w-2xl grid-cols-2 gap-x-8 gap-y-10 text-center sm:grid-cols-3 md:grid-cols-4 lg:mx-0 lg:max-w-none lg:grid-cols-4 xl:grid-cols-5"
      >
        <li
          v-for="person in people"
          :key="person.name"
        >
          <img
            class="mx-auto h-24 w-24 rounded-full"
            :src="person.imageUrl"
            alt=""
          />
          <h3 class="mt-6 text-base font-semibold leading-7 tracking-tight mb-0">{{ person.name }}</h3>
          <p class="text-sm mb-0 leading-6">{{ person.role }}</p>
        </li>
      </ul>
    </div>
  </div>
</template>
