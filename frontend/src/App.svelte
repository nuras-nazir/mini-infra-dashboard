<script>
  import { onMount } from 'svelte';

  let jobs = [];
  let filter = 'all';

  async function fetchJobs() {
    const res = await fetch('http://localhost:3000/jobs');
    jobs = await res.json();
  }

  async function createJob() {
    await fetch('http://localhost:3000/jobs', { method: 'POST' });
    fetchJobs();
  }

  onMount(() => {
    fetchJobs();
    setInterval(fetchJobs, 5000);
  });

  $: filtered = filter === 'all' ? jobs : jobs.filter(j => j.status === filter);
</script>

<main>
  <div class="header">
    <h1>🖥️ Infra Dashboard</h1>
    <p class="subtitle">Live job monitoring system</p>
  </div>

  <div class="controls">
    <button class="create-btn" on:click={createJob}>+ Create Job</button>
    <select bind:value={filter}>
      <option value="all">All Jobs</option>
      <option value="pending">Pending</option>
      <option value="running">Running</option>
      <option value="success">Success</option>
      <option value="failed">Failed</option>
    </select>
    <span class="count">{filtered.length} job(s)</span>
  </div>

  <table>
    <thead>
      <tr>
        <th>ID</th>
        <th>Status</th>
        <th>Start Time</th>
        <th>End Time</th>
      </tr>
    </thead>
    <tbody>
      {#each filtered as job}
        <tr>
          <td class="id">{job.id.slice(0, 8)}...</td>
          <td><span class="badge {job.status}">{job.status.toUpperCase()}</span></td>
          <td>{job.startTime?.slice(11, 19) ?? '—'}</td>
          <td>{job.endTime?.slice(11, 19) ?? '—'}</td>
        </tr>
      {:else}
        <tr><td colspan="4" class="empty">No jobs found. Click + Create Job!</td></tr>
      {/each}
    </tbody>
  </table>
</main>

<style>
  :global(body) {
    margin: 0;
    background: #0f172a;
    color: #e2e8f0;
    font-family: 'Segoe UI', sans-serif;
  }

  main {
    max-width: 900px;
    margin: 40px auto;
    padding: 0 20px;
  }

  .header {
    margin-bottom: 32px;
  }

  h1 {
    font-size: 2rem;
    margin: 0;
    color: #f8fafc;
  }

  .subtitle {
    color: #64748b;
    margin: 4px 0 0;
  }

  .controls {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;
  }

  .create-btn {
    background: #3b82f6;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 0.95rem;
    font-weight: 600;
  }

  .create-btn:hover {
    background: #2563eb;
  }

  select {
    background: #1e293b;
    color: #e2e8f0;
    border: 1px solid #334155;
    padding: 10px 14px;
    border-radius: 8px;
    font-size: 0.95rem;
  }

  .count {
    color: #64748b;
    font-size: 0.9rem;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    background: #1e293b;
    border-radius: 12px;
    overflow: hidden;
  }

  thead {
    background: #0f172a;
  }

  th {
    text-align: left;
    padding: 14px 20px;
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #64748b;
  }

  td {
    padding: 14px 20px;
    border-top: 1px solid #334155;
    font-size: 0.95rem;
  }

  .id {
    font-family: monospace;
    color: #94a3b8;
  }

  .empty {
    text-align: center;
    color: #475569;
    padding: 40px;
  }

  .badge {
    padding: 4px 12px;
    border-radius: 999px;
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.05em;
  }

  .pending  { background: #334155; color: #94a3b8; }
  .running  { background: #1d4ed8; color: #bfdbfe; }
  .success  { background: #166534; color: #86efac; }
  .failed   { background: #991b1b; color: #fca5a5; }
</style>