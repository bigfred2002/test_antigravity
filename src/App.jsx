import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import VisitEntry from './pages/VisitEntry'
import ApiaryDefinition from './pages/ApiaryDefinition'
import HiveDefinition from './pages/HiveDefinition'
import HarvestEntry from './pages/HarvestEntry'
import Inventory from './pages/Inventory'
import Records from './pages/Records'
import EquipmentEntry from './pages/EquipmentEntry'
import EquipmentUpdate from './pages/EquipmentUpdate'
import Administration from './pages/Administration'
import KnowledgeBase from './pages/KnowledgeBase'
import { BeeDataProvider } from './context/BeeDataContext'

function App() {
    return (
        <BeeDataProvider>
            <Router>
                <Routes>
                        <Route path="/" element={<Layout />}>
                            <Route index element={<Dashboard />} />
                            <Route path="visit" element={<VisitEntry />} />
                            <Route path="apiary" element={<ApiaryDefinition />} />
                            <Route path="hives" element={<HiveDefinition />} />
                            <Route path="harvest" element={<HarvestEntry />} />
                            <Route path="inventory" element={<Inventory />} />
                            <Route path="records" element={<Records />} />
                            <Route path="equipment-entry" element={<EquipmentEntry />} />
                            <Route path="equipment-edit" element={<EquipmentUpdate />} />
                            <Route path="administration" element={<Administration />} />
                            <Route path="knowledge" element={<KnowledgeBase />} />
                        </Route>
                    </Routes>
                </Router>
        </BeeDataProvider>
    )
}

export default App
