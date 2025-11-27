import { ComplianceSummary } from "../types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ExternalLink, Calendar, Shield } from "lucide-react";
import { highlightKeywords } from "../utils/highlightKeywords.tsx";

interface RegulationModalProps {
  regulation: ComplianceSummary | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const RegulationModal: React.FC<RegulationModalProps> = ({
  regulation,
  open,
  onOpenChange,
}) => {
  if (!regulation) return null;

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between mb-4">
            <div className="space-y-2">
              <DialogTitle className="text-2xl">{regulation.title}</DialogTitle>
              <DialogDescription className="flex items-center space-x-2">
                <Badge variant="outline">{regulation.category}</Badge>
                <Badge className={getRiskColor(regulation.riskLevel)}>
                  {regulation.riskLevel.toUpperCase()} RISK
                </Badge>
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Metadata */}
          <div className="flex items-center space-x-6 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4" />
              <span>Country: {regulation.country}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>
                Updated: {new Date(regulation.lastUpdated).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Summary with keyword highlighting */}
          <div className="p-6 bg-muted/50 rounded-lg border">
            <h4 className="font-medium mb-3 flex items-center space-x-2">
              <Shield className="w-4 h-4" />
              <span>Regulatory Summary</span>
            </h4>
            <p className="text-foreground leading-relaxed">
              {highlightKeywords(regulation.summary)}
            </p>
          </div>

          {/* Citations */}
          {regulation.citations.length > 0 && (
            <div>
              <h4 className="font-medium mb-3 flex items-center space-x-2">
                <ExternalLink className="w-4 h-4" />
                <span>Official Sources & Citations</span>
              </h4>
              <div className="space-y-3">
                {regulation.citations.map((citation) => (
                  <div
                    key={citation.id}
                    className="p-4 bg-card rounded-lg border hover:border-primary/50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-foreground mb-1">
                          {citation.title}
                        </p>
                        <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                          <span>{citation.source}</span>
                          <span>•</span>
                          <span>
                            {new Date(citation.date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        asChild
                        className="flex-shrink-0"
                      >
                        <a
                          href={citation.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            <Button variant="default">Generate Compliance Report</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
