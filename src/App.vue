<script setup lang="ts">
import { resumeData } from './data/resume'
import Header from './components/Header.vue'
import PersonalInfo from './components/PersonalInfo.vue'
import ProfessionalSummary from './components/ProfessionalSummary.vue'
import Skills from './components/Skills.vue'
import ProjectExperience from './components/ProjectExperience.vue'
import WorkExperience from './components/WorkExperience.vue'
import Honors from './components/Honors.vue'
import Footer from './components/Footer.vue'
</script>

<template>
  <div id="app">
    <Header />
    <main>
      <PersonalInfo :personal-info="resumeData.personalInfo" />
      <ProfessionalSummary :summary="resumeData.professionalSummary" />
      <Skills :skills="resumeData.skills" />
      <ProjectExperience :projects="resumeData.projectExperiences" />
      <WorkExperience :experiences="resumeData.workExperiences" />
      <Honors :honors="resumeData.honors" />
    </main>
    <Footer />
  </div>
</template>

<style>
@import './assets/styles/variables.css';
@import './assets/styles/global.css';

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

main {
  flex: 1;
}
</style>