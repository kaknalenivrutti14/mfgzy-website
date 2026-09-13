<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
import HeroSection from '@/components/hero/HeroSection.vue'
import TrustMetrics from '@/components/common/TrustMetrics.vue'
import LazySection from '@/components/common/LazySection.vue'

/**
 * Everything below the metrics strip is code-split and mounted only as it
 * approaches the viewport. The landing page tells a long story; loading all
 * twenty sections up front would spend the visitor's first second on content
 * they have not scrolled to yet.
 */
const ProblemSection = defineAsyncComponent(() => import('@/components/platform/ProblemSection.vue'))
const PlatformModules = defineAsyncComponent(() => import('@/components/platform/PlatformModules.vue'))
const ManufacturingFlow = defineAsyncComponent(() => import('@/components/manufacturing/ManufacturingFlow.vue'))
const InventorySection = defineAsyncComponent(() => import('@/components/manufacturing/InventorySection.vue'))
const ProductionPlanning = defineAsyncComponent(() => import('@/components/manufacturing/ProductionPlanning.vue'))
const ShopFloorSection = defineAsyncComponent(() => import('@/components/manufacturing/ShopFloorSection.vue'))
const QualitySection = defineAsyncComponent(() => import('@/components/manufacturing/QualitySection.vue'))
const TraceabilitySection = defineAsyncComponent(() => import('@/components/manufacturing/TraceabilitySection.vue'))
const ProcurementSection = defineAsyncComponent(() => import('@/components/manufacturing/ProcurementSection.vue'))
const FinanceSection = defineAsyncComponent(() => import('@/components/manufacturing/FinanceSection.vue'))
const IndustrySelector = defineAsyncComponent(() => import('@/components/industries/IndustrySelector.vue'))
const SecurityArchitecture = defineAsyncComponent(() => import('@/components/security/SecurityArchitecture.vue'))
const RolesPermissions = defineAsyncComponent(() => import('@/components/security/RolesPermissions.vue'))
const AuditTrail = defineAsyncComponent(() => import('@/components/security/AuditTrail.vue'))
const MultiTenant = defineAsyncComponent(() => import('@/components/security/MultiTenant.vue'))
const BulkImport = defineAsyncComponent(() => import('@/components/platform/BulkImport.vue'))
const RoadmapTimeline = defineAsyncComponent(() => import('@/components/roadmap/RoadmapTimeline.vue'))
const AiAssistant = defineAsyncComponent(() => import('@/components/ai/AiAssistant.vue'))
// Pricing is written and ready (components/pricing/PricingSection.vue) but not
// published yet. Restore this import, the <LazySection> below, and the Pricing
// entry in data/navigation.ts together.
// const PricingSection = defineAsyncComponent(() => import('@/components/pricing/PricingSection.vue'))
const FinalCta = defineAsyncComponent(() => import('@/components/common/FinalCta.vue'))
</script>

<template>
  <HeroSection />
  <TrustMetrics />

  <!-- Problem -> one platform -> how it works -->
  <LazySection><ProblemSection /></LazySection>
  <LazySection><PlatformModules /></LazySection>
  <LazySection min-height="900px"><ManufacturingFlow /></LazySection>

  <!-- The plant, module by module -->
  <LazySection><InventorySection /></LazySection>
  <LazySection><ProductionPlanning /></LazySection>
  <LazySection><ShopFloorSection /></LazySection>
  <LazySection><QualitySection /></LazySection>
  <LazySection><TraceabilitySection /></LazySection>
  <LazySection><ProcurementSection /></LazySection>
  <LazySection><FinanceSection /></LazySection>

  <!-- Who it is for, and who may do what -->
  <LazySection><IndustrySelector /></LazySection>
  <LazySection><SecurityArchitecture /></LazySection>
  <LazySection><RolesPermissions /></LazySection>
  <LazySection><AuditTrail /></LazySection>
  <LazySection><MultiTenant /></LazySection>
  <LazySection><BulkImport /></LazySection>

  <!-- Where it is going -->
  <LazySection><RoadmapTimeline /></LazySection>
  <LazySection><AiAssistant /></LazySection>
  <!-- <LazySection><PricingSection /></LazySection> -->
  <LazySection min-height="420px"><FinalCta /></LazySection>
</template>
