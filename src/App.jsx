import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import VisitEntry from './pages/VisitEntry'
import { BeeDataProvider } from './context/BeeDataContext'

function App() {
    return (
        <BeeDataProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route index element={<Dashboard />} />
                        <Route path="visit" element={<VisitEntry />} />
                    </Route>
                </Routes>
            </Router>
        </BeeDataProvider>
    )
}

export default App
