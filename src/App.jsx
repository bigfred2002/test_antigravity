import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import VisitEntry from './pages/VisitEntry'
import VisitHistory from './pages/VisitHistory'
import ApiaryDefinition from './pages/ApiaryDefinition'
import HiveDefinition from './pages/HiveDefinition'
import HiveReview from './pages/HiveReview'
import HarvestEntry from './pages/HarvestEntry'
import Inventory from './pages/Inventory'
import Records from './pages/Records'
import EquipmentEntry from './pages/EquipmentEntry'
import EquipmentUpdate from './pages/EquipmentUpdate'
import Administration from './pages/Administration'
import KnowledgeBase from './pages/KnowledgeBase'
import KnowledgeEditor from './pages/KnowledgeEditor'
import KnowledgeContacts from './pages/KnowledgeContacts'
import KnowledgeSites from './pages/KnowledgeSites'
import KnowledgeDocuments from './pages/KnowledgeDocuments'
import Gallery from './pages/Gallery'
import ContactManager from './pages/ContactManager'
import SiteManager from './pages/SiteManager'
import DocumentManager from './pages/DocumentManager'
import GalleryManager from './pages/GalleryManager'
import { BeeDataProvider } from './context/BeeDataContext'
import { AuthProvider } from './context/AuthContext'
import RequireAuth from './components/RequireAuth'
import Login from './pages/Login'

function App() {
    return (
        <AuthProvider>
            <BeeDataProvider>
                <Router>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route element={<RequireAuth />}>
                            <Route path="/" element={<Layout />}>
                                <Route index element={<Dashboard />} />
                                <Route path="visit" element={<VisitEntry />} />
                                <Route path="visits" element={<VisitHistory />} />
                                <Route path="apiary" element={<ApiaryDefinition />} />
                                <Route path="hives" element={<HiveDefinition />} />
                                <Route path="hives/review" element={<HiveReview />} />
                                <Route path="harvest" element={<HarvestEntry />} />
                                <Route path="inventory" element={<Inventory />} />
                                <Route path="records" element={<Records />} />
                                <Route path="equipment-entry" element={<EquipmentEntry />} />
                                <Route path="equipment-edit" element={<EquipmentUpdate />} />
                                <Route path="administration" element={<Administration />} />
                                <Route path="knowledge" element={<KnowledgeBase />} />
                                <Route path="knowledge/contacts" element={<KnowledgeContacts />} />
                                <Route path="knowledge/sites" element={<KnowledgeSites />} />
                                <Route path="knowledge/documents" element={<KnowledgeDocuments />} />
                                <Route path="gallery" element={<Gallery />} />
                                <Route path="administration/knowledge/contacts" element={<ContactManager />} />
                                <Route path="administration/knowledge/sites" element={<SiteManager />} />
                                <Route path="administration/knowledge/documents" element={<DocumentManager />} />
                                <Route path="administration/gallery" element={<GalleryManager />} />
                                <Route path="knowledge/edit" element={<KnowledgeEditor />} />
                                <Route path="administration/knowledge" element={<KnowledgeEditor />} />
                            </Route>
                        </Route>
                    </Routes>
                </Router>
            </BeeDataProvider>
        </AuthProvider>
    )
}

export default App
