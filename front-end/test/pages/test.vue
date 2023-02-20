<template>
    <div>
        <h1>test page</h1>
    </div>
</template>
<script setup>
import { useSubscription, useQuery } from '@vue/apollo-composable';
import gql from 'graphql-tag'


const { result } = useQuery(gql`
      query {
  doctors {
    id
    full_name
  }
}
    `)
    watch(
      result,
      data => {
        console.log("New message received:", data)
      },
      {
        lazy: true // Don't immediately execute handler
      }
    )
  
</script>