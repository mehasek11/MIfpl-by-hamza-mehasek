'use client';

import { useState, useEffect } from 'react';

export default function SquadRoom() {
  const [activeTab, setActiveTab] = useState(() => {
    try { return JSON.parse(localStorage.getItem('fpl-helper-state') || '{}').activeTab || 'dashboard'; } catch { return 'dashboard'; }
  });
  const [selectedGw, setSelectedGw] = useState(() => {
    try { return JSON.parse(localStorage.getItem('fpl-helper-state') || '{}').selectedGw || 1; } catch { return 1; }
  });
  const [transferTab, setTransferTab] = useState(() => {
    try { return JSON.parse(localStorage.getItem('fpl-helper-state') || '{}').transferTab || 'suggested'; } catch { return 'suggested'; }
  });
  const [marketTab, setMarketTab] = useState(() => {
    try { return JSON.parse(localStorage.getItem('fpl-helper-state') || '{}').marketTab || 'differentials'; } catch { return 'differentials'; }
  });
  const [compareAId, setCompareAId] = useState(() => {
    try { const v = JSON.parse(localStorage.getItem('fpl-helper-state') || '{}').compareAId; return v ? Number(v) : ''; } catch { return ''; }
  });
  const [compareBId, setCompareBId] = useState(() => {
    try { const v = JSON.parse(localStorage.getItem('fpl-helper-state') || '{}').compareBId; return v ? Number(v) : ''; } catch { return ''; }
  });
  const [transferOutId, setTransferOutId] = useState(() => {
    try { const v = JSON.parse(localStorage.getItem('fpl-helper-state') || '{}').transferOutId; return v ? Number(v) : ''; } catch { return ''; }
  });
  const [transferInId, setTransferInId] = useState(() => {
    try { const v = JSON.parse(localStorage.getItem('fpl-helper-state') || '{}').transferInId; return v ? Number(v) : ''; } catch { return ''; }
  });
  const [inputManagerId, setInputManagerId] = useState(() => {
    try { return JSON.parse(localStorage.getItem('fpl-helper-state') || '{}').inputManagerId || '1507193'; } catch { return '1507193'; }
  });
  const [greetingTeamId, setGreetingTeamId] = useState(() => {
    try { return JSON.parse(localStorage.getItem('fpl-helper-state') || '{}').greetingTeamId || ''; } catch { return ''; }
  });
  const [showGreeting, setShowGreeting] = useState(() => {
    try { return !JSON.parse(localStorage.getItem('fpl-helper-state') || '{}').greetingTeamId; } catch { return true; }
  });
  const [savedTransfers, setSavedTransfers] = useState(() => {
    try { return JSON.parse(localStorage.getItem('fpl-helper-state') || '{}').savedTransfers || []; } catch { return []; }
  });
  const [savedTransferIds, setSavedTransferIds] = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem('fpl-helper-state') || '{}').savedTransferIds || []); } catch { return new Set(); }
  });

  // FPL Data States
  const [gameweeks, setGameweeks] = useState([]);
  const [fixtures, setFixtures] = useState([]);
  const [teamMap, setTeamMap] = useState({});
  const [playerMap, setPlayerMap] = useState({});
  const [teamShirtMap, setTeamShirtMap] = useState({});
  const [loadingFixtures, setLoadingFixtures] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [deadlineLabel, setDeadlineLabel] = useState('');
  const [deadlineCountdown, setDeadlineCountdown] = useState('');
  const [managerHistory, setManagerHistory] = useState([]);
  const [captainLog, setCaptainLog] = useState([]);
  const [selectedSetPieceTeam, setSelectedSetPieceTeam] = useState('');

  // Manager & Viewed Team States
  const [managerId, setManagerId] = useState('1507193');
  const [managerData, setManagerData] = useState(null);
  const [managerPicks, setManagerPicks] = useState([]);
  const [viewedTeamName, setViewedTeamName] = useState('');
  const [managerLoading, setManagerLoading] = useState(false);

  // Manager Team Overlay States
  const [showManagerOverlay, setShowManagerOverlay] = useState(false);
  const [overlayManagerData, setOverlayManagerData] = useState(null);
  const [overlayManagerPicks, setOverlayManagerPicks] = useState([]);
  const [overlayManagerLoading, setOverlayManagerLoading] = useState(false);
  const [overlayTeamName, setOverlayTeamName] = useState('');

  // Selected Player for Modal Insights & AI Context
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [playerDetailsLoading, setPlayerDetailsLoading] = useState(false);
  const [playerHistory, setPlayerHistory] = useState([]);
  const [playerUpcoming, setPlayerUpcoming] = useState([]);

  // Selected Fixture for Sofascore Style Summary Modal
  const [selectedFixture, setSelectedFixture] = useState(null);

  // Selected League for Standings & Ranks View
  const [selectedLeague, setSelectedLeague] = useState(null);
  const [leagueStandingsData, setLeagueStandingsData] = useState(null);
  const [leagueLoading, setLeagueLoading] = useState(false);

  // AI Assistant Drawer State
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [aiChatInput, setAiChatInput] = useState('');
  const [aiMessages, setAiMessages] = useState([
    { role: 'assistant', content: "Right, let’s get into it. I can talk through your squad, captaincy calls, transfers, and fixture risk like a proper manager’s assistant. What are you trying to solve right now?" }
  ]);
  const [aiThinking, setAiThinking] = useState(false);
  const [shortlist, setShortlist] = useState([]);
  const [aiBrief, setAiBrief] = useState('');
  const [differentialScan, setDifferentialScan] = useState('');
  const [playerSearch, setPlayerSearch] = useState('');

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('squad-room-shortlist') || '[]');
      if (Array.isArray(saved)) setShortlist(saved);
    } catch (err) {
      console.error('Error loading shortlist', err);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('squad-room-shortlist', JSON.stringify(shortlist));
    }
  }, [shortlist]);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('squad-room-captain-log') || '[]');
      if (Array.isArray(saved)) setCaptainLog(saved);
    } catch (err) {
      console.error('Error loading captain log', err);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('squad-room-captain-log', JSON.stringify(captainLog));
    }
  }, [captainLog]);

  useEffect(() => {
    if (!transferOutId && managerPicks.length && playerMap[managerPicks[0]?.element]) {
      setTransferOutId(managerPicks[0].element);
    }
    if (!transferInId && Object.keys(playerMap).length) {
      const nextTarget = Object.values(playerMap).find((player) => !managerPicks.some((pick) => pick.element === player.id));
      if (nextTarget) setTransferInId(nextTarget.id);
    }
  }, [managerPicks, playerMap, transferOutId, transferInId]);

  useEffect(() => {
    let isMounted = true;
    async function fetchComparisonInsight() {
      if (!playerMap[compareAId] || !playerMap[compareBId]) {
        if (isMounted) setCompareInsight('');
        return;
      }
      if (isMounted) setCompareInsightLoading(true);
      try {
        const playerA = playerMap[compareAId];
        const playerB = playerMap[compareBId];
        const res = await fetch('/api/gemini', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: `Compare these two FPL players and give a detailed verdict with reasoning: ${playerA.webName} vs ${playerB.webName}. Consider price, form, fixtures, and value.`,
            context: { playerA, playerB }
          })
        });
        const data = await res.json();
        if (isMounted) {
          if (res.ok && data.text) {
            setCompareInsight(data.text);
          } else {
            setCompareInsight(getComparisonInsight(playerA, playerB));
          }
        }
      } catch {
        if (isMounted) {
          const playerA = playerMap[compareAId];
          const playerB = playerMap[compareBId];
          if (playerA && playerB) {
            setCompareInsight(getComparisonInsight(playerA, playerB));
          }
        }
      } finally {
        if (isMounted) setCompareInsightLoading(false);
      }
    }
    fetchComparisonInsight();
    return () => { isMounted = false; };
  }, [compareAId, compareBId, playerMap]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const state = {
        transferTab, marketTab, activeTab, selectedGw, inputManagerId,
        greetingTeamId, transferOutId, transferInId, savedTransfers,
        savedTransferIds: Array.from(savedTransferIds),
        compareAId, compareBId
      };
      localStorage.setItem('fpl-helper-state', JSON.stringify(state));
    }
  }, [transferTab, marketTab, activeTab, selectedGw, inputManagerId, greetingTeamId, transferOutId, transferInId, savedTransfers, savedTransferIds, compareAId, compareBId]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const validGw = Number.isFinite(Number(selectedGw)) && Number(selectedGw) > 0 ? Number(selectedGw) : 1;
    if (validGw !== selectedGw) setSelectedGw(validGw);
    if (compareAId && !playerMap[compareAId]) setCompareAId('');
    if (compareBId && !playerMap[compareBId]) setCompareBId('');
    if (transferOutId && !playerMap[transferOutId]) setTransferOutId('');
    if (transferInId && !playerMap[transferInId]) setTransferInId('');
  }, [playerMap, selectedGw, compareAId, compareBId, transferOutId, transferInId]);

  // Fetch Bootstrap Data on Mount
  async function refreshLiveFplData() {
    try {
      const res = await fetch('/api/fpl-proxy', { cache: 'no-store' });
      const data = await res.json();

      if (data.events) {
        setGameweeks(data.events);
        const current = data.events.find(e => e.is_current || e.is_next);
        if (current) setSelectedGw(current.id);
      }

      if (data.teams) {
        const tMap = {};
        const sMap = {};
        data.teams.forEach(team => {
          tMap[team.id] = {
            id: team.id,
            name: team.name,
            short_name: team.short_name,
            code: team.code,
            crest: `https://resources.premierleague.com/premierleague/badges/50/t${team.code}.png`
          };
          sMap[team.id] = team.code;
        });
        setTeamMap(tMap);
        setTeamShirtMap(sMap);
      }

      if (data.elements) {
        const pMap = {};
        data.elements.forEach(player => {
          pMap[player.id] = {
            id: player.id,
            name: `${player.first_name} ${player.second_name}`,
            webName: player.web_name,
            team: player.team,
            element_type: player.element_type,
            now_cost: (player.now_cost / 10).toFixed(1),
            chance_of_playing_next_round: player.chance_of_playing_next_round,
            ep_next: player.ep_next,
            total_points: player.total_points,
            penalties_order: player.penalties_order,
            direct_freekicks_order: player.direct_freekicks_order,
            corners_and_indirect_freekicks_order: player.corners_and_indirect_freekicks_order,
            photoCode: player.photo ? player.photo.replace('.jpg', '') : '223'
          };
        });
        setPlayerMap(pMap);
      }

      setLastUpdated(new Date().toISOString());
      return data;
    } catch (err) {
      console.error('Error loading bootstrap data', err);
      throw err;
    }
  }

  useEffect(() => {
    refreshLiveFplData().catch(() => {});
  }, []);

  useEffect(() => {
    const nextGw = gameweeks.find((gw) => new Date(gw.deadline_time) > new Date()) || gameweeks[0] || null;
    if (!nextGw?.deadline_time) {
      setDeadlineLabel('No deadline loaded');
      return;
    }
    const deadline = new Date(nextGw.deadline_time);
    setDeadlineLabel(deadline.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }));
    const interval = setInterval(() => {
      const now = new Date();
      const diff = Math.max(0, Math.floor((deadline - now) / 1000));
      const days = Math.floor(diff / 86400);
      const hours = Math.floor((diff % 86400) / 3600);
      const minutes = Math.floor((diff % 3600) / 60);
      const seconds = diff % 60;
      setDeadlineCountdown(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    }, 1000);
    return () => clearInterval(interval);
  }, [gameweeks]);

  // Fetch Manager Picks and Standings
  async function handleFetchManager(targetId, customTeamTitle = '') {
    const idToFetch = targetId || managerId;
    if (!idToFetch) return;
    setManagerLoading(true);
    try {
      const manRes = await fetch(`/api/fpl-proxy?endpoint=manager&managerId=${idToFetch}`);
      const manData = await manRes.json();
      if (manData.id) {
        setManagerData(manData);
        setViewedTeamName(customTeamTitle || `${manData.player_first_name} ${manData.player_last_name} (${manData.name})`);
      }

      const picksRes = await fetch(`/api/fpl-proxy?endpoint=picks&managerId=${idToFetch}&event=${selectedGw}`);
      const picksData = await picksRes.json();
      if (picksData.picks) {
        setManagerPicks(picksData.picks);
        setManagerId(idToFetch.toString()); // Properly updates global state to fix the league bug
      }

      const historyRes = await fetch(`/api/fpl-proxy?endpoint=history&managerId=${idToFetch}`);
      const historyData = await historyRes.json();
      if (Array.isArray(historyData.history)) {
        setManagerHistory(historyData.history);
      }

      setLastUpdated(new Date().toISOString());
    } catch (err) {
      console.error('Error fetching manager info', err);
    } finally {
      setManagerLoading(false);
    }
  }

  async function handleViewManagerTeam(entryId, playerName, entryName) {
    setOverlayManagerLoading(true);
    setShowManagerOverlay(true);
    try {
      const manRes = await fetch(`/api/fpl-proxy?endpoint=manager&managerId=${entryId}`);
      const manData = await manRes.json();
      setOverlayManagerData(manData);
      setOverlayTeamName(`${playerName} (${entryName})`);

      const picksRes = await fetch(`/api/fpl-proxy?endpoint=picks&managerId=${entryId}&event=${selectedGw}`);
      const picksData = await picksRes.json();
      if (picksData.picks) {
        setOverlayManagerPicks(picksData.picks);
      }
    } catch (err) {
      console.error('Error fetching manager team for overlay', err);
    } finally {
      setOverlayManagerLoading(false);
    }
  }

  useEffect(() => {
    if (selectedGw && managerId) {
      handleFetchManager(managerId, viewedTeamName);
    }
  }, [selectedGw]);

  useEffect(() => {
    if (!managerPicks.length || !selectedGw) return;
    const captain = managerPicks.find((pick) => pick.is_captain);
    if (!captain || !playerMap[captain.element]) return;

    const captainPlayer = playerMap[captain.element];
    const candidate = Object.values(playerMap)
      .filter((player) => !managerPicks.some((pick) => pick.element === player.id))
      .sort((a, b) => (Number(b.ep_next || 0) - Number(a.ep_next || 0)))[0];

    setCaptainLog((prev) => {
      const nextEntry = {
        gameweek: selectedGw,
        captain: captainPlayer.webName || captainPlayer.name,
        captainTeam: teamMap[captainPlayer.team]?.short_name || 'TEAM',
        bestCandidate: candidate?.webName || '—',
        score: Number(captainPlayer.ep_next || 0).toFixed(1)
      };

      const existingIndex = prev.findIndex((entry) => entry.gameweek === selectedGw);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = nextEntry;
        return updated;
      }
      return [...prev, nextEntry].slice(-12);
    });
  }, [managerPicks, playerMap, selectedGw, teamMap]);

  useEffect(() => {
    const hasLiveFixtures = Array.isArray(fixtures) && fixtures.some((fixture) => fixture.started && !fixture.finished);
    if (!hasLiveFixtures) return;

    const intervalId = setInterval(async () => {
      try {
        const res = await fetch(`/api/fpl-proxy?endpoint=fixtures&event=${selectedGw}`);
        const data = await res.json();
        if (Array.isArray(data)) {
          setFixtures(data);
        }
        setLastUpdated(new Date().toISOString());
      } catch (err) {
        console.error('Error refreshing live fixtures', err);
      }
    }, 15000);

    return () => clearInterval(intervalId);
  }, [fixtures, selectedGw]);

  // Fetch fixtures
  useEffect(() => {
    async function fetchFixturesForGw() {
      if (!selectedGw) return;
      setLoadingFixtures(true);
      try {
        const res = await fetch(`/api/fpl-proxy?endpoint=fixtures&event=${selectedGw}`);
        const data = await res.json();
        setFixtures(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error loading fixtures', err);
      } finally {
        setLoadingFixtures(false);
      }
    }
    fetchFixturesForGw();
  }, [selectedGw]);

  // Fetch League Standings
  async function handleOpenLeague(league) {
    setSelectedLeague(league);
    setLeagueLoading(true);
    try {
      const res = await fetch(`/api/fpl-proxy?endpoint=league&leagueId=${league.id}`);
      const data = await res.json();
      setLeagueStandingsData(data);
    } catch (err) {
      console.error('Error loading league standings', err);
    } finally {
      setLeagueLoading(false);
    }
  }

  // Open Player Drawer & Fetch Detailed Stats
  async function handleOpenPlayerModal(elementId) {
    const player = playerMap[elementId];
    if (!player) return;
    setSelectedPlayer(player);
    setPlayerDetailsLoading(true);

    try {
      const res = await fetch(`/api/fpl-proxy?endpoint=player&playerId=${elementId}`);
      const data = await res.json();
      setPlayerHistory(data.history || []);
      setPlayerUpcoming(data.fixtures || []);
    } catch (err) {
      console.error('Error loading player deep dive', err);
    } finally {
      setPlayerDetailsLoading(false);
    }
  }

  async function handleRefreshAnalysis() {
    try {
      await refreshLiveFplData();
    } catch (err) {
      console.error('Error refreshing live FPL data', err);
    }

    const transferNames = recommendedTransfers.slice(0, 3).map(player => `${player.webName} (£${player.now_cost}m, ${Number(player.ep_next || 0).toFixed(1)} xP)`).join(' • ');
    const gemNames = hiddenGems.slice(0, 3).map(player => `${player.webName} (£${player.now_cost}m)`).join(' • ');

    const refreshPrompt = `Give me a brief FPL update for this squad. Based on the following context, name the best transfer targets and the biggest hidden gems right now. Keep it short and specific. Recommended targets: ${transferNames}. Hidden gems: ${gemNames}. My selected gameweek is GW ${selectedGw}. Use the freshest available data and explain the trade-off clearly.`;

    setAiThinking(true);
    try {
      const context = {
        viewedTeamName,
        managerId,
        selectedGameweek: selectedGw,
        dataRefreshedAt: lastUpdated ? new Date(lastUpdated).toISOString() : 'not available',
        squad: startingXI.slice(0, 11).map(pick => {
          const player = playerMap[pick.element];
          return player ? { name: player.webName || player.name, position: getPositionCategory(player.element_type), price: player.now_cost, points: player.total_points } : null;
        }).filter(Boolean),
        transferTargets: recommendedTransfers.slice(0, 3).map(player => ({ name: player.webName, price: player.now_cost, expectedPoints: Number(player.ep_next || 0).toFixed(1) })),
        hiddenGems: hiddenGems.slice(0, 3).map(player => ({ name: player.webName, price: player.now_cost, expectedPoints: Number(player.ep_next || 0).toFixed(1) }))
      };

      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: refreshPrompt, context })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'AI brief failed');
      setAiBrief(data.text || 'AI brief unavailable.');
    } catch (err) {
      setAiBrief(`AI refresh failed: ${err.message}`);
    } finally {
      setAiThinking(false);
    }
  }

  // Handle AI Chat Submission with Screen Context
  const handleAiSubmit = async (e) => {
    e.preventDefault();
    if (!aiChatInput.trim()) return;

    const userMsg = aiChatInput;
    setAiChatInput('');
    setAiMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setAiThinking(true);

    try {
      const context = {
        viewedTeamName,
        managerId,
        selectedGameweek: selectedGw,
        selectedPlayer: selectedPlayer ? {
          ...selectedPlayer,
          teamName: teamMap[selectedPlayer.team]?.name || 'Unknown team',
          chanceOfPlaying: selectedPlayer.chance_of_playing_next_round ?? 100,
          chanceOfInjury: 100 - (selectedPlayer.chance_of_playing_next_round ?? 100)
        } : null,
        selectedFixture: selectedFixture ? {
          id: selectedFixture.id,
          event: selectedFixture.event,
          home: teamMap[selectedFixture.team_h]?.name || 'Home',
          away: teamMap[selectedFixture.team_a]?.name || 'Away',
          score: selectedFixture.finished ? `${selectedFixture.team_h_score}-${selectedFixture.team_a_score}` : 'Not started',
          started: selectedFixture.started,
          finished: selectedFixture.finished,
          difficulty: `${selectedFixture.team_h_difficulty || '?'} / ${selectedFixture.team_a_difficulty || '?'}`
        } : null,
        squad: startingXI.slice(0, 11).map(pick => {
          const player = playerMap[pick.element];
          if (!player) return null;
          return {
            name: player.webName || player.name,
            position: getPositionCategory(player.element_type),
            price: player.now_cost,
            points: player.total_points,
            team: teamMap[player.team]?.short_name || 'TEAM',
            ep_next: player.ep_next,
            chanceOfPlaying: player.chance_of_playing_next_round ?? 100
          };
        }).filter(Boolean),
        bench: substitutes.slice(0, 4).map(pick => {
          const player = playerMap[pick.element];
          if (!player) return null;
          return {
            name: player.webName || player.name,
            position: getPositionCategory(player.element_type),
            price: player.now_cost,
            points: player.total_points
          };
        }).filter(Boolean),
        fixtures: fixtures.slice(0, 6).map(f => ({
          home: teamMap[f.team_h]?.short_name || 'HOME',
          away: teamMap[f.team_a]?.short_name || 'AWAY',
          difficulty: `${f.team_h_difficulty || '?'} / ${f.team_a_difficulty || '?'}`,
          event: f.event
        })),
        marketTrends: displayedDifferentials.slice(0, 3).map(p => ({
          name: p.webName,
          rating: p.aiRating,
          price: p.now_cost,
          xP: p.ep_next
        }))
      };

      const chatHistory = aiMessages.slice(-8).map((msg) => ({
        role: msg.role,
        content: msg.content
      }));

      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: userMsg,
          context,
          history: chatHistory
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || 'AI request failed');
      }

      setAiMessages(prev => [...prev, { role: 'assistant', content: data.text || 'No response received.' }]);
    } catch (err) {
      setAiMessages(prev => [...prev, {
        role: 'assistant',
        content: `I hit a snag while connecting to the AI assistant. Make sure your GEMINI_API_KEY is set in the .env.local file, then try again. Error: ${err.message}`
      }]);
    } finally {
      setAiThinking(false);
    }
  };

  const startingXI = managerPicks.filter(p => p.position <= 11);
  const substitutes = managerPicks.filter(p => p.position > 11);
  const ownedPlayerIds = new Set(managerPicks.map(pick => pick.element));

  const overlayStartingXI = overlayManagerPicks.filter(p => p.position <= 11);
  const overlaySubstitutes = overlayManagerPicks.filter(p => p.position > 11);
  const overlayGK = overlayStartingXI.filter(p => playerMap[p.element]?.element_type === 1);
  const overlayDEF = overlayStartingXI.filter(p => playerMap[p.element]?.element_type === 2);
  const overlayMID = overlayStartingXI.filter(p => playerMap[p.element]?.element_type === 3);
  const overlayFWD = overlayStartingXI.filter(p => playerMap[p.element]?.element_type === 4);

  const getAiRating = (score) => Math.min(96, Math.max(64, Math.round(score)));

  const captaincySuggestion = managerPicks
    .filter(pick => playerMap[pick.element])
    .map(pick => {
      const player = playerMap[pick.element];
      const fixture = fixtures.find(f => f.team_h === player.team || f.team_a === player.team);
      const difficulty = fixture
        ? (fixture.team_h === player.team ? fixture.team_h_difficulty : fixture.team_a_difficulty)
        : 3;
      return {
        ...pick,
        player,
        pressure: (Number(player.ep_next || 0) * 10) + (Number(player.total_points || 0) / 2) + (difficulty <= 2 ? 8 : difficulty === 3 ? 4 : 0),
      };
    })
    .sort((a, b) => b.pressure - a.pressure)[0];

  const transferRadar = Object.values(playerMap)
    .filter(player => !ownedPlayerIds.has(player.id) && Number(player.now_cost) <= 8.5 && (Number(player.ep_next || 0) > 1 || Number(player.total_points || 0) > 20))
    .map(player => {
      const fixture = fixtures.find(f => f.team_h === player.team || f.team_a === player.team);
      const difficulty = fixture
        ? (fixture.team_h === player.team ? fixture.team_h_difficulty : fixture.team_a_difficulty)
        : 3;
      const opportunityScore = (Number(player.ep_next || 0) * 12) + (Number(player.total_points || 0) / 3) + (difficulty <= 2 ? 10 : difficulty === 3 ? 5 : 0) - Number(player.now_cost) * 3;
      return {
        ...player,
        opportunityScore,
        aiRating: getAiRating(opportunityScore * 1.2)
      };
    })
    .sort((a, b) => b.opportunityScore - a.opportunityScore)
    .slice(0, 3);

  const recommendedTransfers = Object.values(playerMap)
    .filter(player => !ownedPlayerIds.has(player.id) && Number(player.now_cost) <= 8.5 && Number(player.ep_next || 0) > 1.5)
    .map(player => {
      const upcoming = fixtures.filter(fix => fix.team_h === player.team || fix.team_a === player.team).slice(0, 3);
      const difficulty = upcoming.length
        ? upcoming.reduce((sum, fix) => sum + Number(fix.team_h === player.team ? fix.team_h_difficulty : fix.team_a_difficulty || 3), 0) / upcoming.length
        : 3;
      const formBoost = Number(player.total_points || 0) / 2;
      const score = Number(player.ep_next || 0) * 12 + formBoost * 1.8 + (difficulty <= 2 ? 8 : difficulty === 3 ? 4 : 0) - Number(player.now_cost) * 3;
      return { ...player, difficulty, score, aiRating: getAiRating(score * 1.6 + Number(player.total_points || 0) * 0.25), nextGw: selectedGw + 1 };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);

  const differentialPlayers = Object.values(playerMap)
    .filter((player) => !ownedPlayerIds.has(player.id) && Number(player.now_cost) <= 8.5 && Number(player.ep_next || 0) >= 1.0)
    .map((player) => {
      const upcoming = fixtures.filter((fix) => fix.team_h === player.team || fix.team_a === player.team).slice(0, 3);
      const avgDifficulty = upcoming.length
        ? upcoming.reduce((sum, fix) => sum + Number(fix.team_h === player.team ? fix.team_h_difficulty : fix.team_a_difficulty || 3), 0) / upcoming.length
        : 3;
      const score = Number(player.ep_next || 0) * 15 + (Number(player.total_points || 0) / 3) + (avgDifficulty <= 2 ? 9 : avgDifficulty === 3 ? 5 : 0) - Number(player.now_cost) * 2.6;
      return {
        ...player,
        avgDifficulty: Number(avgDifficulty.toFixed(1)),
        differentialScore: Number(score.toFixed(1)),
        aiRating: getAiRating(score * 1.5 + Number(player.total_points || 0) * 0.18)
      };
    })
    .sort((a, b) => b.differentialScore - a.differentialScore)
    .slice(0, 8);

  const hiddenGems = Object.values(playerMap)
    .filter(player => !ownedPlayerIds.has(player.id) && !differentialPlayers.some(p => p.id === player.id) && Number(player.now_cost) <= 6.5 && Number(player.ep_next || 0) >= 1.2)
    .map(player => {
      const fixture = fixtures.find(f => f.team_h === player.team || f.team_a === player.team);
      const difficulty = fixture ? (fixture.team_h === player.team ? fixture.team_h_difficulty : fixture.team_a_difficulty) : 3;
      const gemScore = Number(player.ep_next || 0) * 10 + (Number(player.total_points || 0) / 2) + (difficulty <= 2 ? 8 : difficulty === 3 ? 4 : 0) - Number(player.now_cost) * 2;
      return {
        ...player,
        difficulty,
        gemScore,
        aiRating: getAiRating(gemScore * 1.7 + Number(player.total_points || 0) * 0.2)
      };
    })
    .sort((a, b) => b.gemScore - a.gemScore)
    .slice(0, 5);

  const fixturePressure = managerPicks
    .filter(pick => playerMap[pick.element])
    .map(pick => {
      const player = playerMap[pick.element];
      const fixture = fixtures.find(f => f.team_h === player.team || f.team_a === player.team);
      const difficulty = fixture
        ? (fixture.team_h === player.team ? fixture.team_h_difficulty : fixture.team_a_difficulty)
        : 3;
      return {
        ...pick,
        player,
        risk: difficulty * 5 + (Number(player.chance_of_playing_next_round || 0) < 75 ? 8 : 0),
        difficulty,
      };
    })
    .sort((a, b) => b.risk - a.risk)
    .slice(0, 3);

  const squadHealth = managerPicks.filter(p => playerMap[p.element]).reduce((acc, pick) => {
    const player = playerMap[pick.element];
    acc.totalPoints += Number(player.total_points || 0);
    acc.totalCost += Number(player.now_cost || 0);
    return acc;
  }, { totalPoints: 0, totalCost: 0 });

  const squadBalance = {
    GK: startingXI.filter((pick) => playerMap[pick.element]?.element_type === 1).length,
    DEF: startingXI.filter((pick) => playerMap[pick.element]?.element_type === 2).length,
    MID: startingXI.filter((pick) => playerMap[pick.element]?.element_type === 3).length,
    FWD: startingXI.filter((pick) => playerMap[pick.element]?.element_type === 4).length,
  };

  const watchlistAlerts = shortlist
    .map((playerId) => playerMap[playerId])
    .filter(Boolean)
    .slice(0, 4)
    .map((player) => {
      const fixture = fixtures.find((fix) => fix.team_h === player.team || fix.team_a === player.team);
      const difficulty = fixture
        ? (fixture.team_h === player.team ? fixture.team_h_difficulty : fixture.team_a_difficulty)
        : 3;
      const signal = Number(player.ep_next || 0) >= 3 ? 'Rising' : Number(player.now_cost || 0) <= 5.5 ? 'Value' : 'Watch';
      return {
        ...player,
        difficulty,
        signal,
        note: `${teamMap[player.team]?.short_name || 'TEAM'} • ${difficulty <= 2 ? 'easy fixture' : difficulty === 3 ? 'balanced run' : 'tough test'}`
      };
    });

  const transferOptimizer = [
    {
      title: 'Buy',
      players: transferRadar.slice(0, 2).map(player => ({
        id: player.id,
        name: player.webName,
        detail: `${player.now_cost}m • ${Number(player.ep_next || 0).toFixed(1)} xP`
      }))
    },
    {
      title: 'Hold',
      players: startingXI.slice(0, 2).map(pick => {
        const player = playerMap[pick.element];
        return {
          id: player?.id,
          name: player?.webName || 'Player',
          detail: `${player?.now_cost || 0}m • ${player?.total_points || 0} pts`
        };
      })
    },
    {
      title: 'Sell',
      players: substitutes.slice(0, 2).map(pick => {
        const player = playerMap[pick.element];
        return {
          id: player?.id,
          name: player?.webName || 'Player',
          detail: `${player?.now_cost || 0}m • ${player?.total_points || 0} pts`
        };
      })
    }
  ];

  const leaguePulse = managerData?.leagues?.classic?.slice(0, 3).map((league) => ({
    ...league,
    progress: Math.min(100, (league.entry_rank / Math.max(league.entry_rank + 25, 1)) * 100)
  })) || [];

  const managerKpis = [
    { label: 'Overall rank', value: managerData?.summary_overall_rank ? `#${managerData.summary_overall_rank}` : '—' },
    { label: 'GW points', value: managerData?.summary_event_points ?? '—' },
    { label: 'Total points', value: managerData?.summary_overall_points ?? '—' },
    { label: 'Bank', value: managerData?.last_deadline_bank ? `£${(managerData.last_deadline_bank / 10).toFixed(1)}m` : '—' }
  ];

  const nextDeadline = gameweeks.find((gw) => new Date(gw.deadline_time) > new Date()) || gameweeks[0] || null;
  const nextDeadlineLabel = nextDeadline?.deadline_time
    ? new Date(nextDeadline.deadline_time).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })
    : 'No deadline loaded';

  const setPieceTakers = Object.values(playerMap)
    .filter((player) => {
      const penalties = Number(player.penalties_order || 0);
      const freekicks = Number(player.direct_freekicks_order || 0);
      const corners = Number(player.corners_and_indirect_freekicks_order || 0);
      return penalties > 0 || freekicks > 0 || corners > 0;
    })
    .map((player) => {
      const penalties = Number(player.penalties_order || 0);
      const freekicks = Number(player.direct_freekicks_order || 0);
      const corners = Number(player.corners_and_indirect_freekicks_order || 0);
      const takerType = penalties > 0 ? 'Pens' : freekicks > 0 ? 'Free-kicks' : corners > 0 ? 'Corners' : 'Other';
      const priority = Math.max(penalties, freekicks, corners);
      return {
        ...player,
        takerType,
        priority
      };
    })
    .sort((a, b) => {
      if (b.priority !== a.priority) return b.priority - a.priority;
      return (Number(b.total_points || 0) - Number(a.total_points || 0));
    });

  const getOrdinal = (n) => {
    const s = ['th','st','nd','rd'];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };

  const getClubSetPieceTakers = (clubId, type) => {
    const orderField = type === 'penalties' ? 'penalties_order' : type === 'freekicks' ? 'direct_freekicks_order' : 'corners_and_indirect_freekicks_order';
    return Object.values(playerMap)
      .filter((player) => {
        const clubMatch = !clubId || Number(player.team) === Number(clubId);
        const hasOrder = Number(player[orderField] || 0) > 0;
        return clubMatch && hasOrder;
      })
      .sort((a, b) => Number(a[orderField]) - Number(b[orderField]))
      .slice(0, 5);
  };

  const playerSearchResults = (playerSearch || '').trim()
    ? Object.values(playerMap)
        .filter((player) => {
          const haystack = `${player.webName || ''} ${player.name || ''}`.toLowerCase();
          return haystack.includes(playerSearch.toLowerCase());
        })
        .slice(0, 8)
    : [];

  const benchReview = (managerHistory || [])
    .filter((entry) => Number.isFinite(Number(entry?.points_on_bench)))
    .slice(0, 6)
    .map((entry) => ({
      gameweek: entry.event,
      points: Number(entry.points_on_bench || 0),
      total: Number(entry.points || 0)
    }));

  const captainHitRate = captainLog.length
    ? ((captainLog.filter((row) => Number(row.score || 0) >= 2).length / captainLog.length) * 100).toFixed(0)
    : '0';

  const rivalComparison = [
    {
      name: 'You',
      rank: managerData?.summary_overall_rank ? `#${managerData.summary_overall_rank}` : '—',
      total: managerData?.summary_overall_points ?? 0,
      delta: 'Current'
    },
    ...(leagueStandingsData?.standings?.results?.slice(0, 4) || []).map((row) => ({
      name: row.player_name || 'Rival',
      rank: `#${row.rank}`,
      total: Number(row.total || 0),
      delta: `${Number(row.total || 0) - Number(managerData?.summary_overall_points || 0) >= 0 ? '+' : ''}${Number(row.total || 0) - Number(managerData?.summary_overall_points || 0)}`
    }))
  ].slice(0, 5);

  const ownershipWatch = Object.values(playerMap)
    .filter((player) => Number(player.now_cost) <= 9 && Number(player.ep_next || 0) >= 1.5)
    .map((player) => {
      const momentum = Number(player.ep_next || 0) * 16 + Number(player.total_points || 0) * 0.5 + (Number(player.now_cost) <= 5 ? 10 : 0);
      return {
        ...player,
        momentum: Number(momentum.toFixed(1))
      };
    })
    .sort((a, b) => b.momentum - a.momentum)
    .slice(0, 5);

  const transferTimeline = recommendedTransfers.map((player, index) => ({
    ...player,
    moment: index === 0 ? 'Now' : index === 1 ? 'GW +1' : index === 2 ? 'GW +2' : 'Watch'
  }));

  const displayedDifferentials = differentialPlayers.length
    ? differentialPlayers
    : Object.values(playerMap)
        .filter((player) => !ownedPlayerIds.has(player.id) && Number(player.now_cost) <= 8.5 && Number(player.ep_next || 0) >= 0.7)
        .slice(0, 6)
        .map((player) => ({
          ...player,
          avgDifficulty: 3,
          differentialScore: Number((Number(player.ep_next || 0) * 10 + Number(player.total_points || 0) * 0.2).toFixed(1)),
          aiRating: getAiRating(Number(player.ep_next || 0) * 10 + Number(player.total_points || 0) * 0.4)
        }))
        .sort((a, b) => b.differentialScore - a.differentialScore);

  const handleDifferentialScan = () => {
    const topPlayers = displayedDifferentials.slice(0, 3);
    const scanText = topPlayers.length
      ? `${topPlayers.map((player) => `${player.webName} (${player.differentialScore})`).join(' • ')}`
      : 'No differential targets available right now.';

    setDifferentialScan(scanText);
    setActiveTab('market');
    setMarketTab('differentials');
    setAiMessages((prev) => [
      ...prev,
      {
        role: 'assistant',
        content: `I’ve scanned the market. The strongest differential targets right now are ${topPlayers.map((player) => `${player.webName} (${teamMap[player.team]?.short_name || 'TEAM'} • £${player.now_cost}m)`).join(', ')}. They combine value, upside, and a decent fixture signal, so they’re the types of picks that can create a mini-league edge without taking too much risk.`
      }
    ]);
  };

  const fixtureTakeaways = fixtures.map((fixture) => {
    const homeTeam = teamMap[fixture.team_h];
    const awayTeam = teamMap[fixture.team_a];
    const homeDiff = Number(fixture.team_h_difficulty || 3);
    const awayDiff = Number(fixture.team_a_difficulty || 3);
    const homeName = homeTeam?.short_name || 'Home';
    const awayName = awayTeam?.short_name || 'Away';
    const homeAttack = homeDiff <= 2 ? 'strong attacking setup' : homeDiff === 3 ? 'balanced attacking profile' : 'harder route to chances';
    const awayAttack = awayDiff <= 2 ? 'strong attacking setup' : awayDiff === 3 ? 'balanced attacking profile' : 'harder route to chances';
    const premiumAngle = homeDiff <= 2 && awayDiff >= 3
      ? `${homeName} are the better route for FPL returns because they have the cleaner matchup and usually create the better-value attacking platform.`
      : awayDiff <= 2 && homeDiff >= 3
        ? `${awayName} are the stronger angle because they carry a more favourable difficulty profile and can deliver more reliable xP.`
        : `${homeName} vs ${awayName} is a balanced matchup. The practical move is to lean on the side with cleaner minutes, stronger set-piece threat, and a more consistent rotation profile.`;

    const recommendation = homeDiff <= 2 || awayDiff <= 2
      ? 'Best FPL angle: target the attacking players on the easier side of this fixture, then check set-piece takers and captaincy confidence before locking a decision.'
      : 'Best FPL angle: treat it as a riskier gameweek fixture. Prioritise players with stable minutes and avoid overreacting to short-term volatility unless the matchup is clearly favorable.';

    return {
      ...fixture,
      aiTakeaway: `${homeName} are operating in a ${homeAttack}, while ${awayName} sit in a ${awayAttack}. ${premiumAngle} ${recommendation}`
    };
  });

  const coachPrompts = [
    'Should I wildcard this week?',
    'Who should I captain next GW?',
    'What is the best transfer route?',
    'Which bench boost players should I target?',
    'Who is my safest differential?',
    'Which player should I avoid this round?'
  ];

  const getPositionCategory = (type) => {
    if (type === 1) return 'GKP';
    if (type === 2) return 'DEF';
    if (type === 3) return 'MID';
    if (type === 4) return 'FWD';
    return 'GKP';
  };

  const startingGK = startingXI.filter(p => playerMap[p.element]?.element_type === 1);
  const startingDEF = startingXI.filter(p => playerMap[p.element]?.element_type === 2);
  const startingMID = startingXI.filter(p => playerMap[p.element]?.element_type === 3);
  const startingFWD = startingXI.filter(p => playerMap[p.element]?.element_type === 4);

  const getShirtImageUrl = (playerElement, isGoalkeeper = false) => {
    const player = playerMap[playerElement];
    if (!player) return '';
    const teamCode = teamShirtMap[player.team] || 1;
    const kitType = isGoalkeeper ? '_1' : '';
    return `https://fantasy.premierleague.com/dist/img/shirts/standard/shirt_${teamCode}${kitType}-66.png`;
  };

  const getPlayerPhotoUrl = (photoCode) => {
    return `https://resources.premierleague.com/premierleague/photos/players/110x140/p${photoCode}.png`;
  };

  const getTeamCrestUrl = (teamIdOrCode, size = 70) => {
    if (!teamIdOrCode && teamIdOrCode !== 0) return '';

    const cleaned = String(teamIdOrCode).replace(/[^\d]/g, '');
    if (!cleaned) return '';

    const numericId = Number(cleaned);
    const teamInfo = teamMap[numericId] || Object.values(teamMap).find((team) => Number(team.code) === numericId);
    const resolvedCode = teamInfo?.code ?? teamShirtMap[numericId] ?? cleaned;

    return `https://resources.premierleague.com/premierleague/badges/${size}/t${resolvedCode}.png`;
  };

  const formatLastUpdated = (value) => {
    if (!value) return 'Waiting for live refresh';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return 'Waiting for live refresh';
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getDataFreshnessState = (value) => {
    if (!value) {
      return { label: 'Waiting for FPL refresh', tone: 'amber' };
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return { label: 'Waiting for FPL refresh', tone: 'amber' };
    }

    const minutesOld = Math.max(0, Math.round((Date.now() - date.getTime()) / 60000));

    if (minutesOld <= 3) {
      return { label: `Fresh • updated ${minutesOld}m ago`, tone: 'green' };
    }

    if (minutesOld <= 10) {
      return { label: `Recent • updated ${minutesOld}m ago`, tone: 'amber' };
    }

    return { label: `Stale • updated ${minutesOld}m ago`, tone: 'red' };
  };

  const getFixtureStatus = (fixture) => {
    if (!fixture) {
      return { label: 'Upcoming', isLive: false, isFinished: false, minutes: 0 };
    }

    const minutes = Number(fixture.minutes ?? 0);
    const started = Boolean(fixture.started);
    const finished = Boolean(fixture.finished);

    if (finished) {
      return { label: 'FT', isLive: false, isFinished: true, minutes };
    }

    if (started && minutes > 0) {
      return { label: 'LIVE', isLive: true, isFinished: false, minutes };
    }

    return { label: 'Upcoming', isLive: false, isFinished: false, minutes };
  };

  const getPlayerSummaryStats = (history = []) => {
    const recent = history.slice(-5);
    const points = recent.map(item => Number(item.total_points || 0));
    const goals = history.reduce((sum, item) => sum + Number(item.goals_scored || 0), 0);
    const assists = history.reduce((sum, item) => sum + Number(item.assists || 0), 0);
    const cleanSheets = history.reduce((sum, item) => sum + Number(item.clean_sheets || 0), 0);
    const minutes = history.reduce((sum, item) => sum + Number(item.minutes || 0), 0);
    const average = points.length ? (points.reduce((sum, value) => sum + value, 0) / points.length).toFixed(1) : '0.0';
    return { goals, assists, cleanSheets, minutes, average, recent };
  };

  const getPlayerInsight = (player, history = [], upcoming = []) => {
    if (!player) return 'No player data available.';

    const summary = getPlayerSummaryStats(history);
    const upcomingFixtures = upcoming.slice(0, 3);
    const nextFixture = upcomingFixtures[0];
    const base = Number(player.ep_next || 0);
    const recentAverage = summary.recent.length ? summary.recent.reduce((sum, item) => sum + Number(item.total_points || 0), 0) / summary.recent.length : 0;
    const form = summary.recent.length ? Math.round((recentAverage + base) * 10) / 10 : Number(base.toFixed(1));
    const nextOpp = nextFixture ? teamMap[nextFixture.team_h === player.team ? nextFixture.team_a : nextFixture.team_h]?.short_name || 'next opponent' : 'upcoming fixtures';
    const nextDifficulty = nextFixture ? Number(nextFixture.team_h === player.team ? nextFixture.team_h_difficulty : nextFixture.team_a_difficulty || 3) : 3;
    const risk = nextDifficulty <= 2 ? 'favourable' : nextDifficulty === 3 ? 'balanced' : 'tough';
    const minutesText = summary.minutes ? `${summary.minutes} minutes` : 'no recent minutes recorded';
    const rawChance = Number(player.chance_of_playing_next_round);
    const hasChance = Number.isFinite(rawChance) && rawChance >= 0;
    const chance = hasChance ? rawChance : null;
    const fitnessLabel = chance === null
      ? 'no official FPL fitness update is available yet'
      : chance >= 90
        ? 'very likely to start'
        : chance >= 70
          ? 'likely to be involved'
          : chance >= 50
            ? 'status is still uncertain'
            : 'high risk for selection';
    const recentForm = summary.recent.length ? `${summary.recent.length} recent appearances with ${summary.average} pts average` : 'no recent appearances to assess';
    const goalOrAssist = summary.goals + summary.assists > 0 ? `${summary.goals} goals and ${summary.assists} assists` : 'no goals or assists recorded';
    const fitnessSentence = chance === null
      ? 'The current fitness signal is unavailable from FPL right now.'
      : `The current fitness signal is ${fitnessLabel} (${chance}%).`;

    return `${player.webName} has ${recentForm}, ${goalOrAssist}, and ${minutesText}. ${fitnessSentence} The next fixture is ${risk} against ${nextOpp}. On expected points, he is at ${base.toFixed(1)} xP next and the recent value trend sits at ${form.toFixed(1)} when adjusted for form. That means the practical call is to treat this as a real data-based decision: lean on minutes, recent output, and fixture difficulty rather than a made-up fit score.`;
  };

  const getExpectedPointsNextThree = (player, history = [], upcoming = []) => {
    const recent = history.slice(-5);
    const recentAverage = recent.length
      ? recent.reduce((sum, item) => sum + Number(item.total_points || 0), 0) / recent.length
      : 0;
    const xPBase = Number(player?.ep_next || 0);

    const breakdown = upcoming.slice(0, 3).map((fix) => {
      const oppId = fix.team_h === player?.team ? fix.team_a : fix.team_h;
      const difficulty = Number(fix.difficulty ?? 3);
      const chance = difficulty <= 2 ? 1.35 : difficulty === 3 ? 1.05 : 0.82;
      const expected = Math.max(0, ((xPBase || recentAverage || 0) * chance) + (recentAverage * 0.2));
      return {
        opponent: teamMap[oppId]?.short_name || 'OPP',
        difficulty,
        expected: Number(expected.toFixed(1)),
        homeAway: fix.is_home ? 'H' : 'A'
      };
    });

    const total = breakdown.reduce((sum, item) => sum + item.expected, 0);
    return {
      total: Number(total.toFixed(1)),
      breakdown
    };
  };

  const toggleShortlist = (playerId) => {
    setShortlist((prev) => prev.includes(playerId)
      ? prev.filter((id) => id !== playerId)
      : [...prev, playerId]);
  };

  const PlayerNameButton = ({ player, className = '', showTeam = false, compact = false }) => {
    if (!player) return null;
    const isSaved = shortlist.includes(player.id);
    return (
      <div className="flex items-center gap-2 min-w-0">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleOpenPlayerModal(player.id);
          }}
          className={`truncate font-bold text-white hover:text-[#00ff87] transition-colors text-left ${className}`}
        >
          {player.webName || player.name}
        </button>
        {showTeam && (
          <span className="text-[9px] uppercase tracking-[0.12em] text-purple-400">
            {teamMap[player.team]?.short_name || 'TEAM'}
          </span>
        )}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleShortlist(player.id);
          }}
          className={`rounded-full border px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-[0.12em] transition-colors ${isSaved ? 'border-[#00ff87] bg-[#00ff87]/10 text-[#00ff87]' : 'border-purple-700 bg-[#26002b] text-purple-200 hover:border-[#00ff87] hover:text-[#00ff87]'}`}
        >
          {isSaved ? 'Saved' : compact ? 'Save' : 'Shortlist'}
        </button>
      </div>
    );
  };

  const getPlayerValueScore = (player) => {
    if (!player) return 0;
    const xP = Number(player.ep_next || 0);
    const form = Number(player.total_points || 0) / 8;
    const priceValue = 12 - Number(player.now_cost || 0);
    return xP * 10 + form + priceValue;
  };

  const getTransferInsight = (outPlayer, inPlayer) => {
    if (!outPlayer || !inPlayer) return { rating: 0, text: 'Select both players to get an AI assessment.' };

    const outScore = getPlayerValueScore(outPlayer);
    const inScore = getPlayerValueScore(inPlayer);
    const priceDelta = Number(inPlayer.now_cost || 0) - Number(outPlayer.now_cost || 0);
    const fixtureGain = Number(inPlayer.ep_next || 0) - Number(outPlayer.ep_next || 0);
    const outXp = Number(outPlayer.ep_next || 0);
    const inXp = Number(inPlayer.ep_next || 0);
    const outForm = Number(outPlayer.total_points || 0);
    const inForm = Number(inPlayer.total_points || 0);
    const rating = Math.min(95, Math.max(55, Math.round((inScore * 0.72 + fixtureGain * 20 + (priceDelta <= 0 ? 10 : -8) + (inForm > outForm ? 6 : 0)))));

    let text = `${inPlayer.webName} is the better value play because he carries ${inXp.toFixed(1)} xP, a stronger cost-to-upside profile, and the rate of return is better than ${outPlayer.webName}'s ${outXp.toFixed(1)} xP. The move also improves your squad balance and likely keeps a cleaner route to points.`;

    if (fixtureGain <= 0 && priceDelta > 0) {
      text = `${inPlayer.webName} does offer upside, but the move is not clean on value. ${outPlayer.webName} is still producing ${outXp.toFixed(1)} xP and holds a more stable floor, so the AI only likes this if your team needs a role change or fixture swing rather than pure output.`;
    }

    if (priceDelta <= 0 && fixtureGain > 0) {
      text = `${inPlayer.webName} looks stronger on both value and upside. He offers ${inXp.toFixed(1)} xP versus ${outPlayer.webName}'s ${outXp.toFixed(1)} xP, and the lower cost means you can preserve cash while gaining a clearer points path.`;
    }

    if (outScore > inScore + 4) {
      text = `The AI is cautious because ${outPlayer.webName} still gives a better overall floor. ${inPlayer.webName} is a nice upside play, but the move does not offset the stability, role security, and consistent output you currently get from ${outPlayer.webName}.`;
    }

    return { rating, text };
  };

  const getComparisonInsight = (playerA, playerB) => {
    if (!playerA || !playerB) return 'Pick two players to compare.';

    const aScore = getPlayerValueScore(playerA);
    const bScore = getPlayerValueScore(playerB);
    const winner = aScore >= bScore ? playerA : playerB;
    const loser = winner === playerA ? playerB : playerA;
    const winnerXp = Number(winner.ep_next || 0);
    const loserXp = Number(loser.ep_next || 0);
    const priceGap = Number(winner.now_cost || 0) - Number(loser.now_cost || 0);
    const roleText = winner.element_type === loser.element_type ? 'same role' : 'different role fit';

    return `${winner.webName} edges it on ${winnerXp.toFixed(1)} xP, a better live value profile, and a more useful fit for the current setup. ${loser.webName} still has a decent ceiling, but the numbers suggest ${winner.webName} gives better value at £${winner.now_cost}m versus £${loser.now_cost}m. The AI angle is that ${winner.webName} is the safer and more efficient pick for this team profile (${roleText}).`;
  };

  const renderMatchStat = (statName, identifier) => {
    const stat = selectedFixture?.stats?.find(s => s.identifier === identifier);
    if (!stat || (stat.a.length === 0 && stat.h.length === 0)) return null;
    return (
      <div className="border-t border-purple-900/50 pt-2 mt-2">
        <p className="text-[10px] text-purple-400 uppercase text-center mb-1 font-bold">{statName}</p>
        <div className="flex justify-between text-xs">
          <div className="w-1/2 text-right pr-3 border-r border-purple-900/50 space-y-1">
            {stat.h.map(s => (
              <div key={s.element} className="text-white">
                {playerMap[s.element]?.webName ? <button type="button" onClick={() => handleOpenPlayerModal(s.element)} className="hover:text-[#00ff87] transition-colors">{playerMap[s.element].webName}</button> : 'Player'} <span className="text-[#00ff87] font-bold">({s.value})</span>
              </div>
            ))}
          </div>
          <div className="w-1/2 text-left pl-3 space-y-1">
            {stat.a.map(s => (
              <div key={s.element} className="text-white">
                <span className="text-[#00ff87] font-bold">({s.value})</span> {playerMap[s.element]?.webName ? <button type="button" onClick={() => handleOpenPlayerModal(s.element)} className="hover:text-[#00ff87] transition-colors">{playerMap[s.element].webName}</button> : 'Player'}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen w-full bg-[#37003c] text-white flex flex-col font-sans overflow-x-hidden m-0 p-0 relative">
      {showGreeting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#37003c]">
          <div className="max-w-md w-full mx-4 p-8 rounded-3xl bg-gradient-to-br from-[#19001a] via-[#26002b] to-[#19001a] border border-purple-700 shadow-2xl text-center space-y-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-black tracking-tight text-white">FPL HELPER</h1>
              <p className="text-[10px] text-[#00ff87] uppercase tracking-[0.25em] font-bold">by MEHASEK</p>
            </div>
            <p className="text-sm text-purple-200 leading-relaxed">
              Enter your FPL team ID to load your squad, fixtures, and AI-powered insights.
            </p>
            <form onSubmit={(e) => { e.preventDefault(); if (greetingTeamId.trim()) { setShowGreeting(false); handleFetchManager(greetingTeamId.trim()); } }} className="space-y-3">
              <input
                type="text"
                placeholder="Team ID..."
                value={greetingTeamId}
                onChange={(e) => setGreetingTeamId(e.target.value)}
                className="w-full bg-[#26002b] border border-purple-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#00ff87] text-center"
                autoFocus
              />
              <button
                type="submit"
                className="w-full bg-[#00ff87] text-[#37003c] font-black uppercase tracking-widest text-sm px-6 py-3 rounded-xl hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/25"
              >
                Enter Squad Room
              </button>
            </form>
          </div>
        </div>
      )}
      <div className="max-w-6xl w-full mx-auto p-4 sm:p-6 flex-1 flex flex-col">
        
        {/* Header Bar */}
        <div className="relative overflow-hidden bg-gradient-to-r from-[#19001a] via-[#26002b] to-[#19001a] border border-purple-800/80 pb-4 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-4 py-4 rounded-2xl shadow-[0_18px_40px_rgba(0,0,0,0.25)] ring-1 ring-white/5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(0,255,135,0.18),_transparent_35%)]" />
          <div className="relative flex items-center gap-3">
            <div className="bg-[#00ff87] text-[#37003c] font-black text-xs px-2.5 py-1 rounded-full tracking-tighter shadow-lg shadow-emerald-500/20">
              FPL
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">FPL HELPER</h1>
              <p className="text-[10px] text-[#00ff87] uppercase tracking-widest font-bold">by MEHASEK</p>
            </div>
          </div>

          <div className="relative flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
            <div className="flex gap-2 sm:flex-wrap">
              <button
                type="button"
                onClick={() => setIsAiOpen(true)}
                className="border border-emerald-500/40 bg-[#0d1a12] text-[#00ff87] font-bold text-[10px] uppercase tracking-[0.16em] px-3 py-1.5 rounded-full transition-all hover:scale-[1.02] hover:shadow-[0_0_18px_rgba(0,255,135,0.18)]"
              >
                SquadAI
              </button>
              <button
                type="button"
                onClick={handleRefreshAnalysis}
                className="border border-purple-700 bg-[#26002b] text-purple-100 font-bold text-[10px] uppercase tracking-[0.16em] px-3 py-1.5 rounded-full transition-all hover:border-[#00ff87] hover:text-[#00ff87]"
              >
                {aiThinking ? 'Refreshing...' : 'Quick brief'}
              </button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); setActiveTab('squad'); handleFetchManager(inputManagerId); }} className="relative flex w-full gap-2 sm:w-auto sm:items-center">
              <input 
                type="text" 
                placeholder="Team ID..." 
                value={inputManagerId}
                onChange={(e) => setInputManagerId(e.target.value)}
                className="bg-[#26002b]/80 border border-purple-700 text-white rounded-full px-3 py-1.5 text-xs focus:outline-none focus:border-[#00ff87] w-full sm:w-28 shadow-inner"
              />
              <button 
                type="submit"
                className="bg-[#00ff87] text-[#37003c] font-bold text-xs px-4 py-1.5 rounded-full hover:bg-emerald-400 transition-all uppercase tracking-wider shadow-lg shadow-emerald-500/25 whitespace-nowrap"
              >
                {managerLoading ? 'Loading...' : 'Load'}
              </button>
            </form>
          </div>
        </div>

        <div className="mb-6 rounded-[28px] border border-white/10 bg-gradient-to-r from-[#1d0021] via-[#26002b] to-[#19001a] shadow-[0_18px_45px_rgba(0,0,0,0.25)] overflow-hidden ring-1 ring-white/5">
          <div className="px-4 py-4 sm:px-5">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.25em] text-emerald-300">
                  <span className="h-2 w-2 rounded-full bg-[#00ff87] shadow-[0_0_12px_rgba(0,255,135,0.8)]" />
                  live intelligence
                </div>
                <h2 className="mt-3 text-xl font-black tracking-tight text-white sm:text-2xl">Executive dashboard</h2>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-purple-200">
                <span className="rounded-full border border-purple-700 bg-[#19001a] px-2.5 py-1.5">GW {selectedGw}</span>
                {(() => {
                  const freshness = getDataFreshnessState(lastUpdated);
                  const freshnessClass = freshness.tone === 'green'
                    ? 'border-[#00ff87]/40 bg-[#00ff87]/10 text-[#00ff87]'
                    : freshness.tone === 'amber'
                      ? 'border-amber-400/40 bg-amber-500/10 text-amber-300'
                      : 'border-red-400/40 bg-red-500/10 text-red-300';
                  return (
                    <span className={`inline-flex items-center gap-2 rounded-full border px-2.5 py-1.5 ${freshnessClass}`}>
                      <span className={`h-2 w-2 rounded-full ${freshness.tone === 'green' ? 'bg-[#00ff87]' : freshness.tone === 'amber' ? 'bg-amber-300' : 'bg-red-300'}`} />
                      {freshness.label}
                    </span>
                  );
                })()}
                 <span className="rounded-full border border-[#00ff87]/40 bg-[#00ff87]/10 px-2.5 py-1.5 text-[#00ff87]">FPL snapshot • {formatLastUpdated(lastUpdated)}</span>
                 <span className="rounded-full border border-[#00ff87]/40 bg-[#00ff87]/10 px-2.5 py-1.5 text-[#00ff87]">Best captain: {captaincySuggestion?.player?.webName ? <button type="button" onClick={() => handleOpenPlayerModal(captaincySuggestion.player.id)} className="font-bold hover:text-white transition-colors">{captaincySuggestion.player.webName}</button> : '—'}</span>
                 <span className="rounded-full border border-amber-400/40 bg-amber-500/10 px-2.5 py-1.5 text-amber-300">Risk watch: {fixturePressure[0]?.player?.webName ? <button type="button" onClick={() => handleOpenPlayerModal(fixturePressure[0].player.id)} className="font-bold hover:text-white transition-colors">{fixturePressure[0].player.webName}</button> : '—'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 sm:gap-3 border-b border-purple-900 pb-2 mb-6 px-2">
          {[
            ['dashboard', 'Dashboard'],
            ['squad', 'Pitch View'],
            ['transfers', 'Transfers'],
            ['compare', 'Compare'],
            ['market', 'Market Watch'],
            ['shortlist', 'Shortlist'],
            ['leagues', 'Leagues & Ranks'],
            ['fixtures', 'Fixtures Hub']
          ].map(([key, label]) => (
            <button
              key={key}
              onClick={() => {
                if (key === 'transfers' || key === 'leagues') setSelectedLeague(null);
                setActiveTab(key);
              }}
              className={`font-bold uppercase text-[10px] sm:text-[11px] tracking-[0.15em] sm:tracking-[0.18em] px-2.5 sm:px-3 py-1.5 rounded-full border transition-all ${
                activeTab === key
                  ? 'border-[#00ff87]/60 bg-[#00ff87]/10 text-[#00ff87] shadow-[0_0_12px_rgba(0,255,135,0.15)]'
                  : 'border-transparent bg-[#19001a]/60 text-purple-300 hover:border-purple-700 hover:text-white'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Gameweek Selector */}
        <div className="flex space-x-2 overflow-x-auto pb-4 scrollbar-thin mb-4">
          {gameweeks.map((gw) => (
            <button
              key={gw.id}
              onClick={() => setSelectedGw(gw.id)}
              className={`px-3 py-1 text-xs font-bold uppercase rounded border transition-all whitespace-nowrap ${
                selectedGw === gw.id
                  ? 'bg-[#00ff87] text-[#37003c] border-[#00ff87] shadow'
                  : 'bg-[#26002b] text-purple-200 border-purple-800 hover:bg-purple-900'
              }`}
            >
              GW {gw.id} {gw.is_current ? '• LIVE' : ''}
            </button>
          ))}
        </div>

        {activeTab === 'dashboard' && (
          <>
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-6 animate-[fadeIn_0.35s_ease-out]">
              <div className="bg-[#19001a] border border-purple-800 rounded-2xl p-4 shadow-lg xl:col-span-2">
                <div className="flex items-center justify-between pb-3 border-b border-purple-900 mb-3">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-purple-400">Set-piece takers</p>
                  <span className="text-[10px] text-[#00ff87] uppercase">FPL Data</span>
                </div>

                <div className="mb-3">
                  <select
                    value={selectedSetPieceTeam}
                    onChange={(e) => setSelectedSetPieceTeam(e.target.value)}
                    className="w-full sm:w-auto bg-[#26002b] border border-purple-800 text-white text-xs rounded-lg px-3 py-2 focus:ring-[#00ff87] focus:border-[#00ff87] outline-none"
                  >
                    <option value="">Select a club...</option>
                    {Object.values(teamMap)
                      .sort((a, b) => a.name.localeCompare(b.name))
                      .map((team) => (
                        <option key={team.id} value={team.id}>
                          {team.name}
                        </option>
                      ))}
                  </select>
                </div>

                {selectedSetPieceTeam ? (() => {
                  const penalties = getClubSetPieceTakers(selectedSetPieceTeam, 'penalties');
                  const freekicks = getClubSetPieceTakers(selectedSetPieceTeam, 'freekicks');
                  const corners = getClubSetPieceTakers(selectedSetPieceTeam, 'corners');
                  const sections = [
                    { key: 'penalties', label: 'Penalties', players: penalties, field: 'penalties_order' },
                    { key: 'freekicks', label: 'Free Kicks', players: freekicks, field: 'direct_freekicks_order' },
                    { key: 'corners', label: 'Corners', players: corners, field: 'corners_and_indirect_freekicks_order' },
                  ];
                  return (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {sections.map((section) => (
                        <div key={section.key} className="bg-[#26002b] border border-purple-900 rounded-xl p-3">
                          <p className="text-[10px] uppercase tracking-[0.14em] text-[#00ff87] font-bold mb-3 text-center">{section.label}</p>
                          <div className="space-y-2">
                            {section.players.length ? section.players.map((player, idx) => (
                              <div key={player.id} className="flex items-center gap-2 bg-[#19001a] rounded-lg p-2">
                                <span className="text-[10px] text-purple-400 w-4 text-right">{idx + 1}</span>
                                <span className="text-[10px] text-purple-400 w-5">{getOrdinal(idx + 1)}</span>
                                <img src={getTeamCrestUrl(selectedSetPieceTeam, 30)} alt="" className="w-5 h-5 object-contain" onError={(e) => { e.target.style.display = 'none'; }} />
                                <button
                                  type="button"
                                  onClick={() => handleOpenPlayerModal(player.id)}
                                  className="text-xs font-bold text-white hover:text-[#00ff87] transition-colors cursor-pointer truncate"
                                >
                                  {player.webName}
                                </button>
                                <span className="text-[10px] text-purple-400 ml-auto">{player[section.field]}</span>
                              </div>
                            )) : (
                              <p className="text-[10px] text-purple-400 text-center py-2">No takers</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })() : (
                  <p className="text-xs text-purple-300 text-center py-4">Select a club to view set piece takers.</p>
                )}
              </div>

              <div className="bg-[#19001a] border border-purple-800 rounded-2xl p-4 shadow-lg">
                <div className="flex items-center justify-between pb-3 border-b border-purple-900 mb-3">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-purple-400">Deadline countdown</p>
                  <span className="text-[10px] text-[#00ff87] uppercase">Live</span>
                </div>
                <div className="space-y-3 text-xs text-purple-100">
                  <div className="flex justify-between"><span className="text-purple-400">Next GW deadline</span><span className="font-bold text-white">{deadlineLabel}</span></div>
                  <div className="flex justify-between"><span className="text-purple-400">Countdown</span><span className="font-bold text-[#00ff87]">{deadlineCountdown || 'Calculating...'}</span></div>
                  <div className="flex justify-between"><span className="text-purple-400">Data refresh</span><span className="font-bold text-[#00ff87]">{formatLastUpdated(lastUpdated)}</span></div>
                </div>
              </div>

            </div>
          </>
        )}

        {/* TAB 1: PITCH VIEW */}
        {activeTab === 'squad' && (
          <div className="space-y-6">
            {managerPicks.length === 0 ? (
              <div className="bg-[#26002b] border border-purple-800 rounded-xl p-12 text-center text-purple-300 text-xs uppercase tracking-widest">
                Loading squad lineup and formation...
              </div>
            ) : (
              <div className="rounded-3xl p-8 shadow-2xl relative overflow-hidden border border-emerald-400/50 animate-glow-pulse" style={{
                background: `
                  radial-gradient(circle at 50% 30%, rgba(0, 255, 135, 0.12), transparent 45%),
                  radial-gradient(circle at 20% 80%, rgba(0, 200, 255, 0.08), transparent 40%),
                  radial-gradient(circle at 80% 80%, rgba(255, 0, 128, 0.06), transparent 40%),
                  linear-gradient(180deg, rgba(0, 40, 20, 0.97) 0%, rgba(0, 30, 15, 0.95) 50%, rgba(0, 20, 10, 1) 100%),
                  linear-gradient(90deg, transparent 0%, transparent 49.5%, rgba(255,255,255,0.12) 49.5%, rgba(255,255,255,0.12) 50.5%, transparent 50.5%, transparent 100%),
                  repeating-linear-gradient(0deg, transparent, transparent 28px, rgba(255,255,255,0.03) 28px, rgba(255,255,255,0.03) 29px),
                  repeating-linear-gradient(90deg, transparent, transparent 14.28%, rgba(255,255,255,0.04) 14.28%, rgba(255,255,255,0.04) 14.38%)`,
                backgroundSize: 'cover, cover, cover, cover, cover, 100% 100%, 100% 100%'
              }}>
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(0,255,135,0.1),_transparent_60%)]" />
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#00ff87] to-transparent opacity-60" />
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-40" />
                <div className="relative z-10 flex justify-between items-center mb-8 text-[10px] uppercase tracking-[0.3em] text-emerald-100/90">
                  <span className="font-bold">Formation 4-3-3</span>
                  <span className="text-[#00ff87] font-bold">Manager plan</span>
                </div>

                <div className="relative z-10 space-y-6">
                  <div className="relative">
                    <div className="text-center text-[10px] uppercase font-black tracking-[0.3em] text-amber-300 mb-2 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]">GK</div>
                    <div className="flex justify-center gap-3">{startingGK.map(pick => renderPlayerCard(pick))}</div>
                  </div>
                  <div className="relative">
                    <div className="text-center text-[10px] uppercase font-black tracking-[0.3em] text-sky-300 mb-2 drop-shadow-[0_0_8px_rgba(56,189,248,0.6)]">DEF</div>
                    <div className="flex justify-around gap-3">{startingDEF.map(pick => renderPlayerCard(pick))}</div>
                  </div>
                  <div className="relative">
                    <div className="text-center text-[10px] uppercase font-black tracking-[0.3em] text-emerald-300 mb-2 drop-shadow-[0_0_8px_rgba(52,211,153,0.6)]">MID</div>
                    <div className="flex justify-around gap-3">{startingMID.map(pick => renderPlayerCard(pick))}</div>
                  </div>
                  <div className="relative">
                    <div className="text-center text-[10px] uppercase font-black tracking-[0.3em] text-rose-300 mb-2 drop-shadow-[0_0_8px_rgba(251,113,133,0.6)]">FWD</div>
                    <div className="flex justify-around gap-3">{startingFWD.map(pick => renderPlayerCard(pick))}</div>
                  </div>
                </div>

                <div className="mt-12 pt-6 border-t border-white/10 relative z-10">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <div className="h-px w-8 bg-gradient-to-r from-transparent to-purple-400/60" />
                    <p className="text-[10px] uppercase font-bold tracking-[0.3em] text-purple-200">Substitutes Bench</p>
                    <div className="h-px w-8 bg-gradient-to-l from-transparent to-purple-400/60" />
                  </div>
                  <div className="flex flex-wrap justify-center gap-3">
                    {substitutes.map(pick => renderPlayerCard(pick, true))}
                  </div>
                </div>

              </div>
            )}
          </div>
        )}

        {/* TAB 2: TRANSFERS */}
        {activeTab === 'transfers' && (
          <div className="space-y-6">
            {!playerMap || Object.keys(playerMap).length === 0 || !managerPicks || managerPicks.length === 0 ? (
              <div className="bg-[#26002b] border border-purple-800 rounded-xl p-6 shadow">
                <p className="text-xs text-purple-300 text-center">Loading squad data...</p>
              </div>
            ) : (
            <div className="bg-[#26002b] border border-purple-800 rounded-xl p-6 shadow space-y-4">
              <div className="flex items-center justify-between border-b border-purple-900 pb-3">
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#00ff87]">Transfers</h3>
                <div className="flex gap-2">
                  {['suggested', 'my'].map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setTransferTab(tab)}
                      className={`text-[10px] font-bold uppercase px-3 py-1.5 rounded-full ${transferTab === tab ? 'bg-[#00ff87] text-[#37003c]' : 'bg-[#19001a] text-purple-200 border border-purple-700'}`}
                    >
                      {tab === 'suggested' ? 'AI suggested' : 'My transfers'}
                    </button>
                  ))}
                </div>
              </div>

              {transferTab === 'suggested' ? (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-purple-300">AI recommendations</span>
                    <button type="button" onClick={handleRefreshAnalysis} className="bg-[#00ff87] text-[#37003c] text-[10px] font-bold uppercase px-3 py-1.5 rounded-full">
                      {aiThinking ? 'Refreshing...' : 'Refresh AI brief'}
                    </button>
                  </div>

                  {aiBrief && (
                    <div className="bg-[#19001a] border border-purple-900 rounded-xl p-4 text-sm text-purple-100 leading-relaxed">
                      {aiBrief}
                    </div>
                  )}

                  <div className="bg-[#19001a] border border-purple-900 rounded-xl p-4">
                    <label className="text-[10px] uppercase tracking-[0.18em] text-purple-400 block mb-2">Player lookup</label>
                    <input
                      value={playerSearch}
                      onChange={(e) => setPlayerSearch(e.target.value)}
                      placeholder="Search any player to open their profile..."
                      className="w-full bg-[#26002b] border border-purple-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none"
                    />
                    {playerSearch.trim() && (
                      <div className="mt-3 space-y-2">
                        {playerSearchResults.length ? playerSearchResults.map((player) => (
                          <button
                            key={player.id}
                            type="button"
                            onClick={() => {
                              handleOpenPlayerModal(player.id);
                              setPlayerSearch('');
                            }}
                            className="w-full flex items-center justify-between rounded-lg border border-purple-800 bg-[#26002b] px-3 py-2 text-left hover:border-[#00ff87] transition-colors"
                          >
                            <span className="text-sm font-bold text-white">{player.webName || player.name}</span>
                            <span className="text-[9px] uppercase tracking-[0.12em] text-purple-400">{teamMap[player.team]?.short_name || 'TEAM'}</span>
                          </button>
                         )) : (
                           <p className="text-xs text-purple-300">No player matched that search.</p>
                         )}
                       </div>
                     )}
                   </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {recommendedTransfers.map((player) => {
                      const nextThree = getExpectedPointsNextThree(player, [], fixtures.filter((fix) => fix.team_h === player.team || fix.team_a === player.team).slice(0, 3));
                      return (
                        <div key={player.id} className="bg-[#19001a] border border-purple-900 rounded-xl p-4 hover:border-[#00ff87] transition-all">
                          <div className="flex items-center justify-between gap-2 mb-3">
                            <div>
                              <PlayerNameButton player={player} className="text-sm" showTeam />
                              <p className="text-[10px] text-purple-400">£{player.now_cost}m • {teamMap[player.team]?.short_name || 'TEAM'}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-[9px] uppercase tracking-[0.18em] text-purple-400">AI rating</p>
                              <p className="text-sm font-black text-[#00ff87]">{player.aiRating}/100</p>
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-2 text-[10px] text-purple-200">
                            <div className="bg-[#26002b] rounded-lg p-2"><span className="text-purple-400 block">3GW xP</span><span className="font-bold text-white">{nextThree.total}</span></div>
                            <div className="bg-[#26002b] rounded-lg p-2"><span className="text-purple-400 block">xP</span><span className="font-bold text-white">{Number(player.ep_next || 0).toFixed(1)}</span></div>
                            <div className="bg-[#26002b] rounded-lg p-2"><span className="text-purple-400 block">Diff</span><span className="font-bold text-white">{player.difficulty.toFixed(1)}</span></div>
                          </div>
                          <p className="mt-3 text-[11px] text-purple-100 leading-relaxed">
                            Best made in <span className="text-[#00ff87] font-bold">GW {selectedGw + 1}</span> if you want to front-load value before the next set of big fixtures.
                          </p>
                        </div>
                      );
                    })}
                  </div>

                   <div className="bg-[#19001a] border border-purple-900 rounded-xl p-4">
                     <h4 className="text-xs font-bold uppercase text-purple-300 mb-3">Rate your own transfer</h4>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div>
                         <label className="text-[10px] uppercase tracking-[0.18em] text-purple-400 block mb-2">Transfer out</label>
                         <select value={transferOutId} onChange={(e) => { setTransferOutId(Number(e.target.value)); setTransferInId(''); }} className="w-full bg-[#26002b] border border-purple-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none">
                           {managerPicks
                             .filter((pick) => playerMap[pick.element])
                             .filter((pick) => pick.element !== transferInId)
                             .map((pick) => (
                               <option key={pick.element} value={pick.element}>{playerMap[pick.element]?.webName} ({getPositionCategory(playerMap[pick.element]?.element_type)})</option>
                             ))}
                         </select>
                       </div>
                       <div>
                         <label className="text-[10px] uppercase tracking-[0.18em] text-purple-400 block mb-2">Transfer in</label>
                         <select value={transferInId} onChange={(e) => setTransferInId(Number(e.target.value))} className="w-full bg-[#26002b] border border-purple-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none">
                           {(() => {
                             const outPlayer = playerMap[transferOutId];
                             const samePositionPlayers = Object.values(playerMap).filter((player) => {
                               if (!outPlayer) return true;
                               return player.element_type === outPlayer.element_type;
                             });
                             return samePositionPlayers
                               .filter((player) => !ownedPlayerIds.has(player.id))
                               .filter((player) => player.id !== transferOutId)
                               .map((player) => (
                                 <option key={player.id} value={player.id}>{player.webName} ({getPositionCategory(player.element_type)}) • £{player.now_cost}m</option>
                               ));
                           })()}
                         </select>
                       </div>
                     </div>
                    <div className="flex items-center justify-between gap-3 rounded-xl border border-[#00ff87]/30 bg-[#00ff87]/10 p-3 mt-4">
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.2em] text-[#00ff87]">AI transfer rating</p>
                        {transferRating ? <p className="text-2xl font-black text-white">{transferRating}/100</p> : <p className="text-xs text-purple-200">Choose both players and rate the move.</p>}
                      </div>
                       <div className="flex gap-2">
                         <button
                           type="button"
                           onClick={() => {
                             const outPlayer = playerMap[transferOutId];
                             const inPlayer = playerMap[transferInId];
                             if (!outPlayer || !inPlayer) return;
                             const result = getTransferInsight(outPlayer, inPlayer);
                             setTransferRating(result.rating);
                             setTransferInsight(result.text);
                           }}
                           className="bg-[#00ff87] text-[#37003c] font-bold uppercase text-[10px] px-4 py-2 rounded-full"
                         >
                           Rate transfer
                         </button>
                         {transferRating && (
                           <button
                             type="button"
                             onClick={() => {
                               const outPlayer = playerMap[transferOutId];
                               const inPlayer = playerMap[transferInId];
                               if (!outPlayer || !inPlayer) return;
                               const transferId = `${transferOutId}-${transferInId}`;
                               setSavedTransferIds(prev => {
                                 const next = new Set(prev);
                                 next.add(transferId);
                                 return next;
                               });
                               setSavedTransfers((prev) => {
                                 const exists = prev.some(t => t.outId === transferOutId && t.inId === transferInId);
                                 if (exists) return prev;
                                 return [...prev, {
                                   id: Date.now(),
                                   outId: transferOutId,
                                   inId: transferInId,
                                   outPlayer: outPlayer.webName,
                                   inPlayer: inPlayer.webName,
                                   outPrice: outPlayer.now_cost,
                                   inPrice: inPlayer.now_cost,
                                   rating: transferRating,
                                   insight: transferInsight,
                                   timestamp: new Date().toLocaleString()
                                 }];
                               });
                             }}
                             className={`${savedTransferIds.has(`${transferOutId}-${transferInId}`) ? 'bg-emerald-600 cursor-default' : 'bg-purple-600 hover:bg-purple-500'} text-white font-bold uppercase text-[10px] px-4 py-2 rounded-full transition-colors`}
                         >
                           {savedTransferIds.has(`${transferOutId}-${transferInId}`) ? 'Transfer saved' : 'Save transfer'}
                         </button>
                         )}
                       </div>
                    </div>
                    {transferInsight && (
                      <div className="bg-[#26002b] border border-purple-900 rounded-xl p-4 text-sm text-purple-100 leading-relaxed mt-4 max-h-40 overflow-y-auto scrollbar-thin">
                        {transferInsight}
                      </div>
                     )}
                </>
              ) : (
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-[#00ff87]">Saved Transfers</h3>
                  {savedTransfers.length === 0 ? (
                    <p className="text-xs text-purple-300 py-6 text-center">No saved transfers yet. Rate a transfer in the AI suggested tab and click Save transfer to add it here.</p>
                  ) : (
                    <div className="space-y-3">
                      {savedTransfers.map((saved) => (
                        <div key={saved.id} className="bg-[#19001a] border border-purple-900 rounded-xl p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <p className="text-sm font-black text-white">{saved.outPlayer} → {saved.inPlayer}</p>
                              <p className="text-[10px] text-purple-400">£{saved.outPrice}m → £{saved.inPrice}m • {saved.timestamp}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-[#00ff87] font-black text-sm">{saved.rating}/100</span>
                              <button
                                type="button"
                                onClick={() => {
                                  setSavedTransfers(prev => prev.filter(t => t.id !== saved.id));
                                  setSavedTransferIds(prev => {
                                    const next = new Set(prev);
                                    next.delete(`${saved.outId}-${saved.inId}`);
                                    return next;
                                  });
                                }}
                                className="text-[9px] font-bold uppercase bg-red-500/20 text-red-300 px-2 py-1 rounded hover:bg-red-500/30 transition-colors"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                          {saved.insight && (
                            <p className="text-xs text-purple-100 leading-relaxed mt-2">{saved.insight}</p>
                          )}
                         </div>
                       ))}
                     </div>
                    )}
                  </div>
                )}
           </div>
         )}

        {activeTab === 'compare' && (
          <div className="bg-[#26002b] border border-purple-800 rounded-xl p-6 shadow space-y-5">
            {!playerMap || Object.keys(playerMap).length === 0 ? (
              <p className="text-xs text-purple-300 text-center py-6">Loading player data...</p>
            ) : (
            <div className="flex items-center justify-between border-b border-purple-900 pb-3">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#00ff87]">Compare players</h3>
              <span className="text-[10px] text-purple-300">AI verdict</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#19001a] border border-purple-900 rounded-xl p-4">
                <label className="text-[10px] uppercase tracking-[0.18em] text-purple-400 block mb-2">Player A</label>
                <input
                  type="text"
                  placeholder="Search player..."
                  value={compareASearch || ''}
                  onChange={(e) => setCompareASearch(e.target.value)}
                  className="w-full bg-[#26002b] border border-purple-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#00ff87] mb-2 transition-colors"
                />
                <select value={compareAId} onChange={(e) => setCompareAId(Number(e.target.value))} className="w-full bg-[#26002b] border border-purple-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#00ff87] transition-colors">
                  <option value="">Select player...</option>
                  {Object.values(playerMap)
                    .filter((player) => {
                      const matchesSearch = !compareASearch || player.webName.toLowerCase().includes(compareASearch.toLowerCase());
                      const isNotPlayerB = player.id !== compareBId;
                      return matchesSearch && isNotPlayerB;
                    })
                    .map((player) => (
                      <option key={player.id} value={player.id}>{player.webName} • £{player.now_cost}m</option>
                    ))}
                </select>
              </div>

              <div className="bg-[#19001a] border border-purple-900 rounded-xl p-4">
                <label className="text-[10px] uppercase tracking-[0.18em] text-purple-400 block mb-2">Player B</label>
                <input
                  type="text"
                  placeholder="Search player..."
                  value={compareBSearch || ''}
                  onChange={(e) => setCompareBSearch(e.target.value)}
                  className="w-full bg-[#26002b] border border-purple-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#00ff87] mb-2 transition-colors"
                />
                <select value={compareBId} onChange={(e) => setCompareBId(Number(e.target.value))} className="w-full bg-[#26002b] border border-purple-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#00ff87] transition-colors">
                  <option value="">Select player...</option>
                  {Object.values(playerMap)
                    .filter((player) => {
                      const matchesSearch = !compareBSearch || player.webName.toLowerCase().includes(compareBSearch.toLowerCase());
                      const isNotPlayerA = player.id !== compareAId;
                      return matchesSearch && isNotPlayerA;
                    })
                    .map((player) => (
                      <option key={player.id} value={player.id}>{player.webName} • £{player.now_cost}m</option>
                    ))}
                </select>
              </div>
            </div>

            {playerMap[compareAId] && playerMap[compareBId] && (() => {
              const playerA = playerMap[compareAId];
              const playerB = playerMap[compareBId];
              const statsA = getPlayerSummaryStats(playerHistory);
              const statsB = getPlayerSummaryStats(playerHistory);
              const nextThreeA = getExpectedPointsNextThree(playerA, [], fixtures.filter((fix) => fix.team_h === playerA.team || fix.team_a === playerA.team).slice(0, 3));
              const nextThreeB = getExpectedPointsNextThree(playerB, [], fixtures.filter((fix) => fix.team_h === playerB.team || fix.team_a === playerB.team).slice(0, 3));
              const ownedA = ownedPlayerIds.has(playerA.id);
              const ownedB = ownedPlayerIds.has(playerB.id);

              const fixtureCell = (player, nextThree) => (
                <div className="flex flex-col gap-1">
                  {nextThree.breakdown.map((fix, idx) => (
                    <div key={idx} className="flex items-center justify-center gap-1">
                      <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold ${fix.difficulty <= 2 ? 'bg-emerald-600/80 text-white' : fix.difficulty === 3 ? 'bg-amber-600/80 text-white' : 'bg-red-600/80 text-white'}`}>
                        {fix.homeAway} {fix.opponent} ({fix.difficulty})
                      </span>
                    </div>
                  ))}
                </div>
              );

              const formCell = (player) => {
                const playerFixtures = fixtures.filter((fix) => fix.team_h === player.team || fix.team_a === player.team).slice(0, 5);
                return (
                  <div className="flex flex-wrap gap-1 justify-center">
                    {playerFixtures.length > 0 ? playerFixtures.map((fix, idx) => {
                      const diff = fix.team_h === player.team ? fix.team_h_difficulty : fix.team_a_difficulty;
                      return (
                        <span key={idx} className={`text-[8px] font-mono px-1.5 py-0.5 rounded font-bold ${diff <= 2 ? 'bg-emerald-600/80 text-white' : diff === 3 ? 'bg-amber-600/80 text-white' : 'bg-red-600/80 text-white'}`}>
                          {teamMap[fix.team_h === player.team ? fix.team_a : fix.team_h]?.short_name || 'OPP'}
                        </span>
                      );
                    }) : <span className="text-[9px] text-purple-400">No fixtures</span>}
                  </div>
                );
              };

              const statRows = [
                { label: 'Price', a: `£${playerA.now_cost}m`, b: `£${playerB.now_cost}m` },
                { label: 'Position', a: getPositionCategory(playerA.element_type), b: getPositionCategory(playerB.element_type) },
                { label: 'Total Points', a: playerA.total_points, b: playerB.total_points },
                { label: 'xP (Next)', a: Number(playerA.ep_next || 0).toFixed(1), b: Number(playerB.ep_next || 0).toFixed(1) },
                { label: 'Chance of Playing', a: `${playerA.chance_of_playing_next_round ?? 100}%`, b: `${playerB.chance_of_playing_next_round ?? 100}%` },
                { label: '3GW xP Total', a: nextThreeA.total, b: nextThreeB.total },
                { label: 'Minutes (next 3)', a: `${(nextThreeA.total * 15).toFixed(0)} est.`, b: `${(nextThreeB.total * 15).toFixed(0)} est.` },
                { label: 'Ownership', a: ownedA ? 'Owned' : 'Not in squad', b: ownedB ? 'Owned' : 'Not in squad' },
              ];

              return (
                <div className="space-y-4">
                  <div className="overflow-x-auto rounded-xl border border-purple-900">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="bg-[#19001a]">
                          <th className="text-left text-[10px] uppercase tracking-[0.18em] text-purple-400 px-4 py-3 font-bold w-1/3">Stat</th>
                          <th className="text-center text-[10px] uppercase tracking-[0.18em] text-[#00ff87] px-4 py-3 font-bold">{playerA.webName}</th>
                          <th className="text-center text-[10px] uppercase tracking-[0.18em] text-[#00ff87] px-4 py-3 font-bold">{playerB.webName}</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-t border-purple-900/50 bg-[#19001a]/50">
                          <td className="px-4 py-3 text-purple-400 font-bold">Player</td>
                          <td className="px-4 py-3 text-center">
                            <button
                              type="button"
                              onClick={() => handleOpenPlayerModal(playerA.id)}
                              className="font-bold text-white hover:text-[#00ff87] transition-colors"
                            >
                              {playerA.webName}
                            </button>
                            <p className="text-[9px] text-purple-400 mt-0.5">{teamMap[playerA.team]?.short_name || 'TEAM'}</p>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <button
                              type="button"
                              onClick={() => handleOpenPlayerModal(playerB.id)}
                              className="font-bold text-white hover:text-[#00ff87] transition-colors"
                            >
                              {playerB.webName}
                            </button>
                            <p className="text-[9px] text-purple-400 mt-0.5">{teamMap[playerB.team]?.short_name || 'TEAM'}</p>
                          </td>
                        </tr>
                        {statRows.map((row, idx) => (
                          <tr key={idx} className="border-t border-purple-900/50 hover:bg-[#19001a]/80 transition-colors">
                            <td className="px-4 py-3 text-purple-400 font-bold">{row.label}</td>
                            <td className="px-4 py-3 text-center font-bold text-white">{row.a}</td>
                            <td className="px-4 py-3 text-center font-bold text-white">{row.b}</td>
                          </tr>
                        ))}
                        <tr className="border-t border-purple-900/50">
                          <td className="px-4 py-3 text-purple-400 font-bold">Next 3 Fixtures</td>
                          <td className="px-4 py-3">{fixtureCell(playerA, nextThreeA)}</td>
                          <td className="px-4 py-3">{fixtureCell(playerB, nextThreeB)}</td>
                        </tr>
                        <tr className="border-t border-purple-900/50">
                          <td className="px-4 py-3 text-purple-400 font-bold">Recent Form (next 5)</td>
                          <td className="px-4 py-3">{formCell(playerA)}</td>
                          <td className="px-4 py-3">{formCell(playerB)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {compareInsight && (
                    <div className="bg-gradient-to-r from-[#19001a] via-[#1d0021] to-[#19001a] border border-[#00ff87]/30 rounded-xl p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="bg-[#00ff87] text-[#37003c] text-[9px] font-black px-2 py-0.5 rounded uppercase">AI</span>
                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#00ff87]">Comparison Verdict</p>
                      </div>
                      <p className="text-sm text-purple-100 leading-relaxed">{compareInsight}</p>
                    </div>
                  )}
                </div>
              );
            })()}

            {playerMap[compareAId] && !playerMap[compareBId] && (
              <div className="bg-[#19001a] border border-purple-900 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <button
                      type="button"
                      onClick={() => handleOpenPlayerModal(compareAId)}
                      className="text-sm font-black text-white hover:text-[#00ff87] transition-colors"
                    >
                      {playerMap[compareAId].webName}
                    </button>
                    <p className="text-[10px] text-purple-400">{teamMap[playerMap[compareAId].team]?.short_name || 'TEAM'} • £{playerMap[compareAId].now_cost}m</p>
                  </div>
                  <span className="text-[#00ff87] text-xs font-black">{Number(playerMap[compareAId].ep_next || 0).toFixed(1)} xP</span>
                </div>
                <p className="text-[10px] text-purple-400 mt-3">Select Player B to see the full comparison.</p>
              </div>
            )}

            {playerMap[compareBId] && !playerMap[compareAId] && (
              <div className="bg-[#19001a] border border-purple-900 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <button
                      type="button"
                      onClick={() => handleOpenPlayerModal(compareBId)}
                      className="text-sm font-black text-white hover:text-[#00ff87] transition-colors"
                    >
                      {playerMap[compareBId].webName}
                    </button>
                    <p className="text-[10px] text-purple-400">{teamMap[playerMap[compareBId].team]?.short_name || 'TEAM'} • £{playerMap[compareBId].now_cost}m</p>
                  </div>
                  <span className="text-[#00ff87] text-xs font-black">{Number(playerMap[compareBId].ep_next || 0).toFixed(1)} xP</span>
                </div>
                <p className="text-[10px] text-purple-400 mt-3">Select Player A to see the full comparison.</p>
              </div>
            )}

            {!playerMap[compareAId] && !playerMap[compareBId] && (
              <div className="bg-[#19001a] border border-purple-900 rounded-xl p-8 text-center">
                <p className="text-xs text-purple-300">Select two players above to compare their stats side by side.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'market' && (
          <div className="bg-[#26002b] border border-purple-800 rounded-xl p-6 shadow space-y-5">
            <div className="flex items-center justify-between border-b border-purple-900 pb-3">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#00ff87]">Market watch</h3>
              <div className="flex gap-2">
                {['differentials', 'gems'].map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setMarketTab(tab)}
                    className={`text-[10px] font-bold uppercase px-3 py-1.5 rounded-full ${marketTab === tab ? 'bg-[#00ff87] text-[#37003c]' : 'bg-[#19001a] text-purple-200 border border-purple-700'}`}
                  >
                    {tab === 'differentials' ? 'Differentials' : 'Hidden gems'}
                  </button>
                ))}
              </div>
            </div>

            {marketTab === 'differentials' ? (
              <div className="space-y-4">
                <div className="rounded-xl border border-rose-400/30 bg-rose-500/10 px-3 py-2 text-[11px] text-[#ffe3e3]">
                  <span className="font-bold uppercase tracking-[0.18em] text-rose-300">AI market pulse:</span> {displayedDifferentials.slice(0, 3).map((player) => `${player.webName} ${player.aiRating}/100`).join(' • ')}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {displayedDifferentials.map((player) => (
                    <div key={player.id} className="bg-gradient-to-br from-[#19001a] to-[#2a0a1e] border border-purple-900 rounded-xl p-4 hover:border-rose-400 transition-all cursor-pointer hover:-translate-y-1 hover:shadow-[0_18px_30px_rgba(255,100,100,0.12)]" onClick={() => handleOpenPlayerModal(player.id)}>
                      <div className="flex items-center justify-between gap-3 mb-3">
                        <div>
                          <p className="text-sm font-black text-white">{player.webName}</p>
                          <p className="text-[10px] text-purple-400">{teamMap[player.team]?.short_name || 'TEAM'} • £{player.now_cost}m</p>
                        </div>
                        <span className="bg-rose-500/20 text-rose-300 font-black text-xs px-2 py-1 rounded-full">{player.aiRating}/100</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-[10px]">
                        <div className="bg-[#26002b] rounded-lg p-2 text-purple-200"><span className="text-purple-400 block">xP</span><span className="font-bold text-white">{Number(player.ep_next || 0).toFixed(1)}</span></div>
                        <div className="bg-[#26002b] rounded-lg p-2 text-purple-200"><span className="text-purple-400 block">Diff</span><span className="font-bold text-white">{player.avgDifficulty}</span></div>
                        <div className="bg-[#26002b] rounded-lg p-2 text-purple-200"><span className="text-purple-400 block">Pts</span><span className="font-bold text-white">{player.total_points}</span></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
             ) : (
               <div className="space-y-4">
                 <div className="rounded-xl border border-amber-400/30 bg-amber-500/10 px-3 py-2 text-[11px] text-[#fff3cd]">
                   <span className="font-bold uppercase tracking-[0.18em] text-amber-300">AI value watch:</span> {hiddenGems.slice(0, 3).map((player) => `${player.webName} ${player.aiRating}/100`).join(' • ')}
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                   {hiddenGems.map((player) => (
                     <div key={player.id} className="bg-gradient-to-br from-[#19001a] to-[#26002b] border border-purple-900 rounded-xl p-4 hover:border-amber-400 transition-all cursor-pointer hover:-translate-y-1 hover:shadow-[0_18px_30px_rgba(255,255,255,0.08)]" onClick={() => handleOpenPlayerModal(player.id)}>
                       <div className="flex items-center justify-between mb-3">
                         <div>
                           <p className="text-sm font-black text-white">{player.webName}</p>
                           <p className="text-[10px] text-purple-400">{teamMap[player.team]?.name || 'Team'} • £{player.now_cost}m</p>
                         </div>
                         <span className="bg-amber-500/20 text-amber-300 font-black text-xs px-2 py-1 rounded-full">{player.aiRating}/100</span>
                       </div>
                       <div className="grid grid-cols-2 gap-2 text-[10px]">
                         <div className="bg-[#26002b] rounded-lg p-2 text-purple-200"><span className="text-purple-400 block">xP</span><span className="font-bold text-white">{Number(player.ep_next || 0).toFixed(1)}</span></div>
                         <div className="bg-[#26002b] rounded-lg p-2 text-purple-200"><span className="text-purple-400 block">TPoints</span><span className="font-bold text-white">{player.total_points}</span></div>
                       </div>
                     </div>
                   ))}
                 </div>
               </div>
             )}
          </div>
        )}

        {/* TAB 4: SHORTLIST */}
        {activeTab === 'shortlist' && (
          <div className="bg-[#26002b] border border-purple-800 rounded-xl p-6 shadow space-y-4">
            <div className="flex items-center justify-between border-b border-purple-900 pb-3">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#00ff87]">Saved shortlist</h3>
              <span className="text-[10px] text-purple-300">{shortlist.length} players</span>
            </div>

            {shortlist.length === 0 ? (
              <p className="text-xs text-purple-300 py-6 text-center">Shortlist players from the transfer or gems panel and come back here to track them.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {shortlist.map((playerId) => {
                  const player = playerMap[playerId];
                  if (!player) return null;
                  const nextThree = getExpectedPointsNextThree(player, [], fixtures.filter((fix) => fix.team_h === player.team || fix.team_a === player.team).slice(0,3));
                  return (
                    <div key={playerId} className="bg-[#19001a] border border-purple-900 rounded-xl p-4 hover:border-[#00ff87] transition-all cursor-pointer" onClick={() => handleOpenPlayerModal(playerId)}>
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="text-sm font-black text-white">{player.webName}</p>
                          <p className="text-[10px] text-purple-400">{teamMap[player.team]?.short_name || 'TEAM'} • £{player.now_cost}m</p>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); toggleShortlist(playerId); }}
                          className="text-[10px] font-bold uppercase rounded-full bg-[#00ff87] text-[#37003c] px-2 py-1"
                        >
                          Remove
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[10px]">
                        <div className="bg-[#26002b] rounded-lg p-2 text-purple-200"><span className="text-purple-400 block">3GW xP</span><span className="font-bold text-white">{nextThree.total}</span></div>
                        <div className="bg-[#26002b] rounded-lg p-2 text-purple-200"><span className="text-purple-400 block">Form</span><span className="font-bold text-white">{player.total_points}</span></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: LEAGUES */}
        {activeTab === 'leagues' && (
          <div className="space-y-6">
            {!selectedLeague ? (
              <div className="bg-[#26002b] border border-purple-800 rounded-xl p-6 shadow space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#00ff87]">Mini-Leagues Standings</h3>
                {!managerData?.leagues?.classic ? (
                  <p className="text-xs text-purple-300">Load your manager ID in the header to view league standings.</p>
                ) : (
                  <div className="space-y-3">
                    {managerData.leagues.classic.map((league) => (
                      <div 
                        key={league.id} 
                        onClick={() => handleOpenLeague(league)}
                        className="bg-[#19001a] hover:bg-purple-950 border border-purple-900 hover:border-[#00ff87] cursor-pointer rounded-lg p-4 flex justify-between items-center transition-all"
                      >
                        <div>
                          <h4 className="font-bold text-sm text-white">{league.name}</h4>
                          <p className="text-[10px] text-purple-400">Your Rank: <span className="text-[#00ff87] font-bold">#{league.entry_rank}</span></p>
                        </div>
                        <span className="text-xs font-mono bg-purple-900 px-3 py-1 rounded text-purple-200 uppercase font-bold">
                          View Table ➔
                        </span>
                      </div>
                    ))}
                  </div>
                      )}
                   </div>
                 </div>
               </>
               ) : (
              <div className="bg-[#26002b] border border-purple-800 rounded-xl p-6 shadow space-y-6">
                <div className="flex justify-between items-center border-b border-purple-900 pb-3">
                  <div>
                    <button onClick={() => setSelectedLeague(null)} className="text-xs text-[#00ff87] hover:underline font-bold mb-1 block">
                      ← Back to Leagues
                    </button>
                    <h3 className="text-base font-black text-white">{selectedLeague.name}</h3>
                  </div>
                  <span className="text-xs bg-purple-900 px-3 py-1 rounded font-mono text-emerald-300 font-bold">
                    Standings Table
                  </span>
                </div>

                {leagueLoading ? (
                  <p className="text-xs text-purple-300 text-center py-8">Loading league table and teams...</p>
                ) : (
                  <div className="space-y-2 overflow-x-auto">
                    <div className="min-w-[500px]">
                      <div className="grid grid-cols-12 text-[10px] font-bold uppercase text-purple-400 pb-2 border-b border-purple-900 px-3">
                        <span className="col-span-1">Rank</span>
                        <span className="col-span-5">Manager & Team</span>
                        <span className="col-span-3 text-center">GW Points</span>
                        <span className="col-span-3 text-right">Total Pts</span>
                      </div>
                       {leagueStandingsData?.standings?.results?.map((row) => (
                         <div 
                           key={row.id}
                           onClick={() => handleViewManagerTeam(row.entry, row.player_name, row.entry_name)}
                           className={`grid grid-cols-12 items-center p-3 rounded-lg cursor-pointer transition-colors text-xs border ${
                             row.entry === Number(managerId) 
                               ? 'bg-[#00ff87]/10 border-[#00ff87]' 
                               : 'bg-[#19001a] border-purple-900 hover:bg-purple-900/50'
                           }`}
                         >
                          <span className="col-span-1 font-mono font-bold text-[#00ff87]">#{row.rank}</span>
                          <div className="col-span-5 truncate">
                            <p className="font-bold text-white truncate">{row.player_name}</p>
                            <p className="text-[10px] text-purple-400 truncate">{row.entry_name}</p>
                          </div>
                          <span className="col-span-3 text-center font-mono">{row.event_total}</span>
                          <span className="col-span-3 text-right font-black font-mono text-emerald-400">{row.total}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: FIXTURES HUB */}
        {activeTab === 'fixtures' && (
          <div className="bg-[#26002b] border border-purple-800 rounded-xl p-6 shadow space-y-4 animate-[fadeIn_0.35s_ease-out]">
            <div className="flex items-center justify-between border-b border-purple-900 pb-2">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#00ff87]">
                Gameweek {selectedGw} Fixtures & Match Centers
              </h3>
              <span className="text-[10px] text-purple-300">Sofascore style</span>
            </div>
            {loadingFixtures ? (
              <p className="text-xs text-purple-300 text-center py-8">Loading fixtures...</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {fixtureTakeaways.map(f => {
                  const home = teamMap[f.team_h]?.name || `Team ${f.team_h}`;
                  const away = teamMap[f.team_a]?.name || `Team ${f.team_a}`;
                  const homeShort = teamMap[f.team_h]?.short_name || 'HOME';
                  const awayShort = teamMap[f.team_a]?.short_name || 'AWAY';
                  const difficultyLabel = f.team_h_difficulty && f.team_a_difficulty
                    ? `${f.team_h_difficulty} / ${f.team_a_difficulty}`
                    : '—';
                  const kickoffText = f.kickoff_time ? new Date(f.kickoff_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'TBD';
                  const matchStatus = getFixtureStatus(f);
                  const statusText = matchStatus.label;
                  const scoreText = matchStatus.isFinished || matchStatus.isLive
                    ? `${f.team_h_score} - ${f.team_a_score}`
                    : kickoffText;
                  const homeWinner = Number(f.team_h_score || 0) > Number(f.team_a_score || 0) && matchStatus.isFinished;
                  const awayWinner = Number(f.team_a_score || 0) > Number(f.team_h_score || 0) && matchStatus.isFinished;
                  const homeSideClass = homeWinner ? 'bg-gradient-to-r from-emerald-500/35 via-emerald-400/10 to-transparent' : awayWinner ? 'bg-gradient-to-r from-red-500/30 via-red-400/8 to-transparent' : 'bg-transparent';
                  const awaySideClass = awayWinner ? 'bg-gradient-to-r from-emerald-500/35 via-emerald-400/10 to-transparent' : homeWinner ? 'bg-gradient-to-r from-red-500/30 via-red-400/8 to-transparent' : 'bg-transparent';

                  return (
                    <div 
                      key={f.id} 
                      onClick={() => setSelectedFixture(f)}
                      className="bg-[#19001a] hover:bg-purple-950 border border-purple-900 hover:border-[#00ff87] cursor-pointer rounded-2xl p-3.5 transition-all shadow-md hover:shadow-[0_12px_30px_rgba(0,255,135,0.08)] hover:-translate-y-0.5"
                    >
                      <div className="flex items-center justify-between text-[9px] uppercase tracking-[0.18em] text-purple-400 mb-3">
                        <span>{statusText}</span>
                        <span>Diff {difficultyLabel}</span>
                      </div>

                      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                        <div className={`flex items-center gap-2 min-w-0 rounded-xl p-2 ${homeSideClass}`}>
                          <img src={getTeamCrestUrl(f.team_h, 50)} alt={home} className="w-8 h-8 object-contain drop-shadow-md" onError={(e) => { e.target.style.display = 'none'; }} />
                          <div className="min-w-0">
                            <p className="text-[10px] text-purple-400 uppercase">Home</p>
                            <span className="text-xs font-bold truncate block">{home}</span>
                            <span className="text-[9px] text-purple-300">{homeShort}</span>
                          </div>
                        </div>

                        <div className="text-center min-w-[94px]">
                          <span className="text-sm font-black font-mono bg-[#26002b] border border-purple-700 px-3 py-1.5 rounded-full text-[#00ff87] inline-block min-w-[78px]">
                            {scoreText}
                          </span>
                          <p className="text-[9px] text-purple-400 mt-1 uppercase">Match Center</p>
                        </div>

                        <div className={`flex items-center justify-end gap-2 min-w-0 rounded-xl p-2 text-right ${awaySideClass}`}>
                          <div className="min-w-0">
                            <p className="text-[10px] text-purple-400 uppercase">Away</p>
                            <span className="text-xs font-bold truncate block">{away}</span>
                            <span className="text-[9px] text-purple-300">{awayShort}</span>
                          </div>
                          <img src={getTeamCrestUrl(f.team_a, 50)} alt={away} className="w-8 h-8 object-contain drop-shadow-md" onError={(e) => { e.target.style.display = 'none'; }} />
                        </div>
                      </div>

                      <div className="mt-4 rounded-xl border border-purple-900 bg-[#26002b]/80 p-2">
                        <p className="text-[9px] uppercase tracking-[0.18em] text-[#00ff87] font-bold">AI takeaway</p>
                        <p className="mt-1 text-[10px] text-purple-100 leading-relaxed">{f.aiTakeaway}</p>
                      </div>

                      <div className="mt-4 flex items-center justify-between text-[10px] text-purple-300 border-t border-purple-900 pt-2">
                        <span>{f.kickoff_time ? new Date(f.kickoff_time).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' }) : 'Fixture'}</span>
                        <span>Venue: {f.is_home ? 'Home' : 'Away'}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* PLAYER SLIDING DRAWER WITH OFFICIAL ACTION PHOTO */}
        {selectedPlayer && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex justify-end z-40 transition-opacity">
                <div className="bg-[#26002b] border-l border-purple-600 h-full max-w-md w-full p-6 shadow-2xl relative text-white space-y-6 overflow-y-auto animate-slide-in-right">
              <div className="flex justify-between items-center border-b border-purple-900 pb-4">
                <span className="bg-[#00ff87] text-[#37003c] text-[10px] font-extrabold px-2 py-0.5 rounded uppercase">
                  {getPositionCategory(selectedPlayer.element_type)}
                </span>
                <button 
                  onClick={() => setSelectedPlayer(null)}
                  className="text-purple-400 hover:text-white font-bold text-sm bg-purple-900/50 w-8 h-8 rounded-full flex items-center justify-center"
                >
                  ✕
                </button>
              </div>

              <div className="flex items-center gap-4 bg-[#19001a] border border-purple-900 rounded-2xl p-4 shadow-inner">
                <div className="w-20 h-24 bg-purple-950 rounded-xl overflow-hidden flex-shrink-0 border border-purple-700 flex items-center justify-center relative">
                  <img 
                    src={getPlayerPhotoUrl(selectedPlayer.photoCode)} 
                    alt={selectedPlayer.name}
                    className="h-28 object-cover mt-2"
                    onError={(e) => { e.target.src = 'https://resources.premierleague.com/premierleague/photos/players/110x140/photo-missing.png'; }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h2 className="text-lg font-black truncate">{selectedPlayer.webName || selectedPlayer.name}</h2>
                    <img src={getTeamCrestUrl(selectedPlayer.team, 40)} alt="team crest" className="w-7 h-7 object-contain" onError={(e) => { e.target.style.display = 'none'; }} />
                  </div>
                  <p className="text-xs text-purple-300 mt-1">£{selectedPlayer.now_cost}m • Total: <span className="text-[#00ff87] font-bold">{selectedPlayer.total_points} Pts</span></p>
                  <p className="text-[10px] text-purple-400 mt-1 uppercase font-bold">Official PL Registered Player</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => toggleShortlist(selectedPlayer.id)}
                className={`w-full rounded-xl border px-3 py-2 text-[10px] font-bold uppercase tracking-[0.18em] transition-colors ${shortlist.includes(selectedPlayer.id) ? 'border-[#00ff87] bg-[#00ff87]/10 text-[#00ff87]' : 'border-purple-700 bg-[#26002b] text-purple-100 hover:border-[#00ff87] hover:text-[#00ff87]'}`}
              >
                {shortlist.includes(selectedPlayer.id) ? 'Shortlisted' : 'Add to shortlist'}
              </button>

               {(() => {
                 const fittedChance = Number(selectedPlayer.chance_of_playing_next_round);
                 const chanceOfPlaying = Number.isFinite(fittedChance) ? fittedChance : 100;
                 const chanceOfInjury = 100 - chanceOfPlaying;
                 const playerOwned = managerPicks.some((pick) => pick.element === selectedPlayer.id);
                 const recentMinutes = playerHistory.slice(-5).reduce((sum, item) => sum + Number(item.minutes || 0), 0);
                 const recentAverage = playerHistory.length
                   ? (playerHistory.slice(-5).reduce((sum, item) => sum + Number(item.total_points || 0), 0) / Math.min(playerHistory.length, 5)).toFixed(1)
                   : '0.0';

                 let injuryDetail = null;
                 if (!Number.isFinite(fittedChance)) {
                   injuryDetail = { type: 'Unknown', duration: 'No data from FPL' };
                 } else if (fittedChance < 100 && fittedChance >= 75) {
                   injuryDetail = { type: 'Minor knock / fatigue', duration: 'Likely 1-2 weeks' };
                 } else if (fittedChance >= 50 && fittedChance < 75) {
                   injuryDetail = { type: 'Moderate injury concern', duration: 'Approx 2-4 weeks' };
                 } else if (fittedChance >= 25 && fittedChance < 50) {
                   injuryDetail = { type: 'Significant injury', duration: '4-8 weeks' };
                 } else if (fittedChance < 25 && fittedChance > 0) {
                   injuryDetail = { type: 'Long-term absence', duration: '8+ weeks' };
                 }

                 return (
                   <div className="grid grid-cols-2 gap-3">
                     <div className="bg-[#19001a] border border-purple-900 p-3 rounded-lg">
                       <p className="text-[10px] text-purple-400 uppercase">Chance of playing</p>
                       <p className="text-lg font-black text-[#00ff87] mt-1">{chanceOfPlaying}%</p>
                       {injuryDetail && fittedChance < 100 && (
                         <p className="text-[9px] text-purple-300 mt-1 uppercase tracking-wider">{injuryDetail.type} • {injuryDetail.duration}</p>
                       )}
                     </div>
                     <div className="bg-[#19001a] border border-purple-900 p-3 rounded-lg">
                       <p className="text-[10px] text-purple-400 uppercase">Chance of injury</p>
                       <p className="text-lg font-black text-rose-400 mt-1">{chanceOfInjury}%</p>
                       {injuryDetail && fittedChance < 100 && (
                         <p className="text-[9px] text-purple-300 mt-1 uppercase tracking-wider">FPL status: {fittedChance}% availability</p>
                       )}
                     </div>
                    <div className="bg-[#19001a] border border-purple-900 p-3 rounded-lg">
                      <p className="text-[10px] text-purple-400 uppercase">Mins (last 5)</p>
                      <p className="text-lg font-black text-white mt-1">{recentMinutes}</p>
                      <p className="text-[10px] uppercase tracking-[0.12em] text-purple-300 mt-2">{recentAverage} pts avg</p>
                    </div>
                    <div className="bg-[#19001a] border border-purple-900 p-3 rounded-lg">
                      <p className="text-[10px] text-purple-400 uppercase">Ownership</p>
                      <p className="text-lg font-black text-white mt-1">{playerOwned ? 'Owned' : 'Not in squad'}</p>
                      <p className="text-[10px] uppercase tracking-[0.12em] text-purple-300 mt-2">{playerOwned ? 'Your team' : 'Available'}</p>
                    </div>
                    <div className="bg-[#19001a] border border-purple-900 p-3 rounded-lg">
                      <p className="text-[10px] text-purple-400 uppercase">xP (Next)</p>
                      <p className="text-lg font-black text-white mt-1">{selectedPlayer.ep_next || '—'}</p>
                      <p className="text-[10px] uppercase tracking-[0.12em] text-purple-300 mt-2">£{selectedPlayer.now_cost}m</p>
                    </div>
                  </div>
                );
              })()}

              <div className="bg-[#19001a] border border-purple-900 rounded-xl p-3">
                <p className="text-[10px] uppercase tracking-[0.18em] text-[#00ff87] font-bold">AI player insight</p>
                <p className="mt-2 text-xs leading-relaxed text-purple-100">{getPlayerInsight(selectedPlayer, playerHistory, playerUpcoming)}</p>
              </div>

              {(() => {
                const nextThree = getExpectedPointsNextThree(selectedPlayer, playerHistory, playerUpcoming);
                return (
                  <div className="bg-[#19001a] border border-purple-900 rounded-xl p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] uppercase text-purple-400 tracking-wider">Expected points next 3 GW</p>
                      <span className="text-[#00ff87] font-black text-sm">{nextThree.total}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {nextThree.breakdown.map((item, index) => (
                        <div key={`${item.opponent}-${index}`} className="bg-[#26002b] border border-purple-900 rounded-lg p-2 text-center">
                          <p className="text-[9px] text-purple-400 uppercase">{item.homeAway} vs {item.opponent}</p>
                          <p className="text-sm font-black text-white mt-1">{item.expected}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}

              <div className="grid grid-cols-2 gap-3">
                {(() => {
                  const summary = getPlayerSummaryStats(playerHistory);
                  return [
                    { label: 'Recent avg', value: `${summary.average} pts` },
                    { label: 'Goals', value: `${summary.goals}` },
                    { label: 'Assists', value: `${summary.assists}` },
                    { label: 'Clean sheets', value: `${summary.cleanSheets}` }
                  ].map((item) => (
                    <div key={item.label} className="bg-[#19001a] border border-purple-900 p-3 rounded-lg">
                      <p className="text-[10px] text-purple-400 uppercase">{item.label}</p>
                      <p className="text-lg font-black text-white mt-1">{item.value}</p>
                    </div>
                  ));
                })()}
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase text-purple-300 tracking-wider">Next 3 Fixtures</h4>
                {playerDetailsLoading ? (
                  <p className="text-xs text-purple-400">Loading fixtures...</p>
                ) : (
                  <div className="grid grid-cols-3 gap-2">
                    {playerUpcoming.slice(0, 3).map((fix, idx) => (
                      <div key={idx} className="bg-[#19001a] border border-purple-900 p-2.5 rounded text-center space-y-1.5 flex flex-col justify-center items-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <img src={getTeamCrestUrl(fix.team_h === selectedPlayer.team ? fix.team_a : fix.team_h, 30)} className="w-5 h-5 object-contain" alt="opp crest" onError={(e) => { e.target.style.display = 'none'; }} />
                          <span className="text-[9px] font-bold uppercase text-purple-200">{fix.is_home ? 'H' : 'A'}</span>
                        </div>
                        <p className="text-[10px] font-bold uppercase text-purple-200">
                          {teamMap[fix.team_h === selectedPlayer.team ? fix.team_a : fix.team_h]?.short_name || 'OPP'}
                        </p>
                        <span className={`text-[10px] font-mono px-2 py-1 rounded font-bold w-full ${
                          fix.difficulty <= 2 ? 'bg-emerald-600/80 text-white' : fix.difficulty === 3 ? 'bg-amber-600/80 text-white' : 'bg-red-600/80 text-white'
                        }`}>
                          Diff: {fix.difficulty}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2 pb-16">
                <h4 className="text-xs font-bold uppercase text-purple-300 tracking-wider">Recent Form</h4>
                {playerHistory.length > 0 ? (
                  <div className="bg-[#19001a] border border-purple-900 p-3 rounded-lg space-y-2">
                    {playerHistory.slice(-5).reverse().map((item, idx) => (
                      <div key={`${item.round}-${idx}`} className="flex justify-between items-center text-[10px] text-purple-100">
                        <span className="font-bold text-purple-300">GW {item.round}</span>
                        <span>{item.minutes} mins</span>
                        <span className="text-[#00ff87] font-black">{item.total_points} pts</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-purple-400">No match history available.</p>
                )}
              </div>

            </div>
          </div>
        )}

        {/* SOFASCORE STYLE MATCH SUMMARY MODAL */}
        {selectedFixture && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center z-40 p-4">
            <div className="bg-[#26002b] border border-purple-600 rounded-2xl max-w-md w-full p-6 shadow-2xl relative text-white space-y-6 max-h-[90vh] overflow-y-auto scrollbar-thin">
              <button 
                onClick={() => setSelectedFixture(null)}
                className="absolute top-4 right-4 text-purple-400 hover:text-white font-bold text-sm bg-purple-900/50 w-8 h-8 rounded-full flex items-center justify-center"
              >
                ✕
              </button>

              <div className="text-center space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-widest bg-[#00ff87] text-[#37003c] px-2 py-0.5 rounded">
                  Match Center • Fixture Insight
                </span>
                <div className="flex justify-between items-center mt-4 px-2 gap-2">
                  <div className="w-5/12 text-right space-y-2">
                    <img src={getTeamCrestUrl(selectedFixture.team_h, 52)} alt={teamMap[selectedFixture.team_h]?.name} className="w-12 h-12 object-contain mx-auto md:ml-auto" onError={(e) => { e.target.style.display = 'none'; }} />
                    <p className="font-black text-sm">{teamMap[selectedFixture.team_h]?.name}</p>
                    <p className="text-[10px] text-purple-400 uppercase">{teamMap[selectedFixture.team_h]?.short_name}</p>
                  </div>
                  <div className="w-2/12 text-center font-mono text-xl font-black text-[#00ff87]">
                    {getFixtureStatus(selectedFixture).isFinished || getFixtureStatus(selectedFixture).isLive ? `${selectedFixture.team_h_score}-${selectedFixture.team_a_score}` : 'VS'}
                  </div>
                  <div className="w-5/12 text-left space-y-2">
                    <img src={getTeamCrestUrl(selectedFixture.team_a, 52)} alt={teamMap[selectedFixture.team_a]?.name} className="w-12 h-12 object-contain mx-auto md:mr-auto" onError={(e) => { e.target.style.display = 'none'; }} />
                    <p className="font-black text-sm">{teamMap[selectedFixture.team_a]?.name}</p>
                    <p className="text-[10px] text-purple-400 uppercase">{teamMap[selectedFixture.team_a]?.short_name}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 bg-[#19001a] border border-purple-900 p-4 rounded-xl text-xs">
                <div className="flex justify-between border-b border-purple-900 pb-2">
                  <span className="text-purple-400">Match Status</span>
                  <span className="font-bold text-[#00ff87]">{getFixtureStatus(selectedFixture).isFinished ? 'Full Time' : getFixtureStatus(selectedFixture).isLive ? 'Live in Progress' : 'Upcoming Kickoff'}</span>
                </div>
                <div className="flex justify-between border-b border-purple-900 pb-2">
                  <span className="text-purple-400">Gameweek</span>
                  <span className="font-bold">GW {selectedFixture.event}</span>
                </div>
                <div className="flex justify-between border-b border-purple-900 pb-2">
                  <span className="text-purple-400">Kickoff</span>
                  <span className="font-bold">{selectedFixture.kickoff_time ? new Date(selectedFixture.kickoff_time).toLocaleString([], { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'TBD'}</span>
                </div>
                <div className="flex justify-between pb-2">
                  <span className="text-purple-400">Difficulty Rating</span>
                  <span className="font-bold font-mono">{selectedFixture.team_h_difficulty} / {selectedFixture.team_a_difficulty}</span>
                </div>

                {selectedFixture.started && selectedFixture.stats && (
                  <div className="mt-4 pt-2">
                    <h4 className="text-[11px] font-bold uppercase text-purple-300 text-center mb-2">Match Events</h4>
                    {renderMatchStat('Goals', 'goals_scored')}
                    {renderMatchStat('Assists', 'assists')}
                    {renderMatchStat('Bonus Points', 'bonus')}
                    {renderMatchStat('Saves', 'saves')}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#19001a] border border-purple-900 p-3 rounded-lg">
                  <p className="text-[10px] text-purple-400 uppercase">Home diff</p>
                  <p className="text-lg font-black text-white mt-1">{selectedFixture.team_h_difficulty}</p>
                </div>
                <div className="bg-[#19001a] border border-purple-900 p-3 rounded-lg">
                  <p className="text-[10px] text-purple-400 uppercase">Away diff</p>
                  <p className="text-lg font-black text-white mt-1">{selectedFixture.team_a_difficulty}</p>
                </div>
              </div>

              {selectedFixture.finished && (
                <div className="bg-purple-950/60 border border-purple-700/60 p-4 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-[#00ff87] text-[#37003c] text-[9px] font-black px-1.5 py-0.5 rounded">AI</span>
                    <p className="text-[10px] font-bold uppercase text-[#00ff87] tracking-wider">Tactical Takeaways</p>
                  </div>
                  <p className="text-xs text-purple-100 leading-relaxed">
                    {selectedFixture.team_h_score === selectedFixture.team_a_score
                      ? 'A tightly contested match likely shaped the midfield battle and set-piece battle. Watch for late-game chaos, especially in the wide channels and second-ball situations.'
                      : `${selectedFixture.team_h_score > selectedFixture.team_a_score ? teamMap[selectedFixture.team_h]?.name : teamMap[selectedFixture.team_a]?.name} controlled the key phases and looked sharper in transition. The margin likely came from better half-space progression and a cleaner final-third entry pattern.`}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* FLOATING AI ASSISTANT BUTTON & DRAWER */}
        <div className="fixed bottom-4 right-4 z-50 sm:bottom-6 sm:right-6">
          {!isAiOpen ? (
            <button
              onClick={() => setIsAiOpen(true)}
              className="bg-[#00ff87] hover:bg-emerald-400 text-[#37003c] p-3.5 sm:p-4 rounded-full shadow-[0_0_15px_rgba(0,255,135,0.4)] flex items-center justify-center font-black transition-transform hover:scale-110 border-2 border-white"
              title="Open SquadAI Assistant"
            >
              🤖
            </button>
          ) : (
            <div className="bg-[#26002b] border border-purple-600 rounded-2xl w-[calc(100vw-1.5rem)] max-w-[22rem] sm:w-80 sm:max-w-none h-[440px] sm:h-[480px] shadow-2xl flex flex-col overflow-hidden text-white animate-in slide-in-from-bottom duration-300">
              
              {/* AI Header */}
              <div className="bg-[#19001a] border-b border-purple-900 p-3.5 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="bg-[#00ff87] text-[#37003c] text-xs font-black px-2 py-0.5 rounded">AI</span>
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-wider">SquadAI Assistant</h3>
                    <p className="text-[9px] text-[#00ff87]">Screen-Aware Active</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsAiOpen(false)}
                  className="text-purple-400 hover:text-white font-bold text-xs bg-purple-900/50 w-6 h-6 rounded-full flex items-center justify-center"
                >
                  ✕
                </button>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 p-3 overflow-y-auto space-y-3 text-xs scrollbar-thin">
                {aiMessages.map((msg, index) => (
                  <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] rounded-xl p-3 ${
                      msg.role === 'user' 
                        ? 'bg-[#00ff87] text-[#37003c] font-bold' 
                        : 'bg-[#19001a] border border-purple-900 text-purple-100'
                    }`}>
                      <p className="whitespace-pre-line leading-relaxed">{msg.content}</p>
                    </div>
                  </div>
                ))}
                {aiThinking && (
                  <div className="flex justify-start">
                    <div className="bg-[#19001a] border border-purple-900 text-purple-400 rounded-xl p-3 text-xs animate-pulse">
                      Analyzing tactics and underlying metrics...
                    </div>
                  </div>
                )}
              </div>

              <div className="px-3 pb-2">
                <div className="flex flex-wrap gap-2">
                  {['Should I wildcard?', 'Who should I captain?', 'Best transfer route', 'Bench boost plan', 'Who is my safest differential?', 'Fixture congestion'].map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => setAiChatInput(chip)}
                      className="bg-[#26002b] border border-purple-700 text-[10px] uppercase tracking-wide text-purple-200 rounded-full px-2.5 py-1 hover:border-[#00ff87] hover:text-[#00ff87] transition-colors"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat Input */}
              <form onSubmit={handleAiSubmit} className="p-3 bg-[#19001a] border-t border-purple-900 flex gap-2">
                <input 
                  type="text"
                  placeholder={selectedPlayer ? `Ask about ${selectedPlayer.webName}...` : "Ask AI anything about your squad..."}
                  value={aiChatInput}
                  onChange={(e) => setAiChatInput(e.target.value)}
                  className="flex-1 bg-[#26002b] border border-purple-700 text-white rounded px-3 py-2 text-xs focus:outline-none focus:border-[#00ff87]"
                />
                <button 
                  type="submit"
                  className="bg-[#00ff87] text-[#37003c] font-bold text-xs px-4 py-2 rounded hover:bg-emerald-400 uppercase tracking-wide"
                >
                  Send
                </button>
              </form>
            </div>
          )}
        </div>

      </div>

      {showManagerOverlay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-2 sm:p-4" onClick={() => setShowManagerOverlay(false)}>
          <div className="w-full max-w-5xl max-h-[95vh] overflow-hidden bg-[#19001a] border border-purple-700 rounded-2xl shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-3 sm:p-4 border-b border-purple-900">
              <div>
                <h3 className="text-sm font-black uppercase tracking-widest text-white">{overlayTeamName || 'Manager Team'}</h3>
                {overlayManagerData && (
                  <p className="text-[10px] text-purple-400">Overall rank: #{overlayManagerData.summary_overall_rank || '—'} • Total points: {overlayManagerData.summary_overall_points || 0}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setShowManagerOverlay(false)}
                className="text-purple-300 hover:text-white text-2xl font-bold leading-none px-2"
              >
                ×
              </button>
            </div>

             {overlayManagerLoading ? (
                <div className="p-8 text-center text-purple-300 text-xs uppercase tracking-widest">Loading team lineup...</div>
             ) : (
              <div className="p-3 sm:p-4 space-y-4 overflow-y-auto max-h-[calc(95vh-60px)]">
                  {overlayManagerPicks.length === 0 ? (
                    <p className="text-xs text-purple-300 text-center py-6">No picks available for this gameweek.</p>
                  ) : (
                    <div className="rounded-3xl p-6 shadow-2xl relative overflow-hidden border border-emerald-400/50 animate-glow-pulse" style={{
                      background: `
                        radial-gradient(circle at 50% 30%, rgba(0, 255, 135, 0.12), transparent 45%),
                        radial-gradient(circle at 20% 80%, rgba(0, 200, 255, 0.08), transparent 40%),
                        radial-gradient(circle at 80% 80%, rgba(255, 0, 128, 0.06), transparent 40%),
                        linear-gradient(180deg, rgba(0, 40, 20, 0.97) 0%, rgba(0, 30, 15, 0.95) 50%, rgba(0, 20, 10, 1) 100%),
                        linear-gradient(90deg, transparent 0%, transparent 49.5%, rgba(255,255,255,0.12) 49.5%, rgba(255,255,255,0.12) 50.5%, transparent 50.5%, transparent 100%),
                        repeating-linear-gradient(0deg, transparent, transparent 28px, rgba(255,255,255,0.03) 28px, rgba(255,255,255,0.03) 29px),
                        repeating-linear-gradient(90deg, transparent, transparent 14.28%, rgba(255,255,255,0.04) 14.28%, rgba(255,255,255,0.04) 14.38%)`,
                      backgroundSize: 'cover, cover, cover, cover, cover, 100% 100%, 100% 100%'
                    }}>
                      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(0,255,135,0.1),_transparent_60%)]" />
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#00ff87] to-transparent opacity-60" />
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-40" />
                      <div className="relative z-10 flex justify-between items-center mb-8 text-[10px] uppercase tracking-[0.3em] text-emerald-100/90">
                        <span className="font-bold">Formation {overlayGK.length}-{overlayDEF.length}-{overlayMID.length}-{overlayFWD.length}</span>
                        <span className="text-[#00ff87] font-bold">Manager lineup</span>
                      </div>

                      <div className="relative z-10 space-y-6">
                        <div className="relative">
                          <div className="text-center text-[10px] uppercase font-black tracking-[0.3em] text-amber-300 mb-2 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]">GK</div>
                          <div className="flex justify-center gap-3">{overlayGK.map(pick => renderPlayerCard(pick))}</div>
                        </div>
                        <div className="relative">
                          <div className="text-center text-[10px] uppercase font-black tracking-[0.3em] text-sky-300 mb-2 drop-shadow-[0_0_8px_rgba(56,189,248,0.6)]">DEF</div>
                          <div className="flex justify-around gap-3">{overlayDEF.map(pick => renderPlayerCard(pick))}</div>
                        </div>
                        <div className="relative">
                          <div className="text-center text-[10px] uppercase font-black tracking-[0.3em] text-emerald-300 mb-2 drop-shadow-[0_0_8px_rgba(52,211,153,0.6)]">MID</div>
                          <div className="flex justify-around gap-3">{overlayMID.map(pick => renderPlayerCard(pick))}</div>
                        </div>
                        <div className="relative">
                          <div className="text-center text-[10px] uppercase font-black tracking-[0.3em] text-rose-300 mb-2 drop-shadow-[0_0_8px_rgba(251,113,133,0.6)]">FWD</div>
                          <div className="flex justify-around gap-3">{overlayFWD.map(pick => renderPlayerCard(pick))}</div>
                        </div>
                      </div>

                      <div className="mt-12 pt-6 border-t border-white/10 relative z-10">
                        <div className="flex items-center justify-center gap-2 mb-4">
                          <div className="h-px w-8 bg-gradient-to-r from-transparent to-purple-400/60" />
                          <p className="text-[10px] uppercase font-bold tracking-[0.3em] text-purple-200">Substitutes Bench</p>
                          <div className="h-px w-8 bg-gradient-to-l from-transparent to-purple-400/60" />
                        </div>
                        <div className="flex flex-wrap justify-center gap-3">
                          {overlaySubstitutes.map(pick => renderPlayerCard(pick, true))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
            )}
    </div>
  );

  function renderPlayerCard(pick, isBench = false) {
    const player = playerMap[pick.element];
    if (!player) return null;

    const isGk = player.element_type === 1;
    const shirtUrl = getShirtImageUrl(pick.element, isGk);

    const gwPoints = pick.stats?.total_points ?? null;
    const seasonPoints = Number(player.total_points || 0);
    const displayPoints = gwPoints !== null ? gwPoints : seasonPoints;
    const effectivePoints = pick.multiplier * displayPoints;
    const isSeasonFallback = gwPoints === null;

    return (
      <div
        key={pick.element}
        onClick={() => handleOpenPlayerModal(pick.element)}
        className={`group relative rounded-2xl p-3 w-36 sm:w-40 md:w-44 text-center transition-all duration-300 cursor-pointer flex flex-col items-center ${
          isBench
            ? 'bg-[#19001a]/80 border border-purple-800/60 opacity-90 hover:opacity-100'
            : 'bg-[#19001a]/95 border border-purple-500/40 hover:border-[#00ff87]'
        } shadow-[0_20px_50px_rgba(0,0,0,0.6)] hover:-translate-y-2 hover:shadow-[0_30px_60px_rgba(0,255,135,0.25)]`}
        style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
      >
        {pick.is_captain && (
          <span className="absolute -top-2 -right-2 bg-gradient-to-br from-yellow-300 to-amber-500 text-[#37003c] text-[10px] font-black w-7 h-7 rounded-full flex items-center justify-center shadow-[0_0_12px_rgba(251,191,36,0.6)] z-20 border-2 border-[#37003c] animate-pulse">
            C
          </span>
        )}
        {pick.is_vice_captain && (
          <span className="absolute -top-2 -right-2 bg-gradient-to-br from-gray-200 to-gray-400 text-[#37003c] text-[10px] font-black w-7 h-7 rounded-full flex items-center justify-center shadow-[0_0_12px_rgba(255,255,255,0.5)] z-20 border-2 border-[#37003c]">
            V
          </span>
        )}

        <div className="h-16 flex items-center justify-center my-1">
          {shirtUrl ? (
            <img src={shirtUrl} alt="kit" className="h-14 object-contain drop-shadow-[0_10px_15px_rgba(0,0,0,0.5)] group-hover:drop-shadow-[0_12px_20px_rgba(0,255,135,0.35)] transition-all duration-300" />
          ) : (
            <div className="w-12 h-12 rounded-full bg-purple-900"></div>
          )}
        </div>

        <div className="bg-[#26002b] w-full rounded-xl p-2 mt-2 border border-purple-900 shadow-inner">
          <div className="text-sm font-extrabold text-white truncate px-1">
            {player.webName || player.name}
          </div>
          <div className="text-[11px] text-emerald-400 font-mono mt-1 flex justify-center gap-1">
            <span>£{player.now_cost}m</span>
            <span>•</span>
            <span className="font-bold">{effectivePoints} pts</span>
          </div>
          {isSeasonFallback && (
            <div className="text-[9px] text-purple-400 mt-0.5 uppercase tracking-wider">Season total</div>
          )}
        </div>
      </div>
    );
  }
}
