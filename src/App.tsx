import { Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { HomePage } from "./pages/HomePage";
import { CategoryPage } from "./pages/CategoryPage";
import { FunctionPage } from "./pages/FunctionPage";
import { RequestBoardPage } from "./pages/RequestBoardPage";
import { ShortcutsPage } from "./pages/ShortcutsPage";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/category/:categoryId" element={<CategoryPage />} />
        <Route path="/function/:functionId" element={<FunctionPage />} />
        <Route path="/requests" element={<RequestBoardPage />} />
        <Route path="/shortcuts" element={<ShortcutsPage />} />
      </Route>
    </Routes>
  );
}

export default App;
