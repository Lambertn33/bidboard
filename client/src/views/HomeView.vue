<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
    <!-- Hero Section -->
    <HeroSection />

    <!-- Features Section -->
    <FeaturesSection :features="features" />
    
    <!-- How It Works Section -->
    <WorkSection :works="works" />

    <!-- CTA Section -->
    <JoinSection />
  </div>
</template>

<script setup lang="ts">
import HeroSection from '../components/home/HeroSection.vue';
import FeaturesSection from '../components/home/FeaturesSection.vue';
import WorkSection from '../components/home/WorkSection.vue';
import JoinSection from '../components/home/JoinSection.vue';

import { IFeature } from '../interfaces/home/IFeature';
import { IWork } from '../interfaces/home/IWork';


const features: IFeature[] = [
  {
    title: 'Transparent Bidding',
    description: 'Submit competitive bids on tasks that match your skills. Clear pricing and fair competition.',
    icon: 'bi-check-circle-fill',
    iconBgColor: 'bg-blue-600'
  },
  {
    title: 'Quick Turnaround',
    description: 'Micro-tasks designed for fast completion. Get paid quickly for quality work delivered on time.',
    icon: 'hi-clock',
    iconBgColor: 'bg-green-600'
  },
  {
    title: 'Track Earnings',
    description: 'Monitor your balance, pending payments, and work history all in one place.',
    icon: 'ri-bar-chart-fill',
    iconBgColor: 'bg-purple-600'
  }
]

const works: IWork[] = [
  {
    title: 'Browse Tasks',
    subtitle: 'Explore available tasks that match your skills'
  },
  {
    title: 'Submit Bid',
    subtitle: 'Place your bid with a compelling message'
  },
  {
    title: 'Get Assigned',
    subtitle: 'Admin reviews and assigns the task to you'
  },
  {
    title: 'Complete & Get Paid',
    subtitle: 'Submit your work and receive payment'
  }
]
</script>



